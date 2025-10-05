import { validationResult } from 'express-validator';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import { computeBalances, simplifyDebts } from '../utils/settlement.js';

export const createGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const group = await Group.create({ name: req.body.name.trim() });
    return res.status(201).json({ group });
  } catch (e) { next(e); }
};

export const listGroups = async (_req, res, next) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    return res.json({ groups });
  } catch (e) { next(e); }
};

export const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    return res.json({ group });
  } catch (e) { next(e); }
};

export const renameGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { name } = req.body;
    const g = await Group.findByIdAndUpdate(
      groupId,
      { $set: { name: String(name || "").trim() } },
      { new: true }
    );
    if (!g) return res.status(404).json({ message: "Group not found" });
    return res.json({ group: g });
  } catch (e) {
    next(e);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const g = await Group.findByIdAndDelete(req.params.groupId);
    if (!g) return res.status(404).json({ message: 'Group not found' });
    await Expense.deleteMany({ group: g._id });
    return res.json({ ok: true });
  } catch (e) { next(e); }
};

export const addMember = async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    group.members.push({ name: String(name || '').trim() });
    await group.save();
    return res.status(201).json({ group });
  } catch (e) { next(e); }
};

export const updateMember = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.params;
    const { name } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    const m = group.members.id(memberId);
    if (!m) return res.status(404).json({ message: "Member not found" });
    m.name = String(name || "").trim();
    if (!m.name) return res.status(400).json({ message: "Name required" });
    await group.save();
    return res.json({ group });
  } catch (e) {
    next(e);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    group.members.id(memberId)?.deleteOne();
    await group.save();
    await Expense.updateMany(
      { group: groupId },
      { $pull: { participants: memberId } }
    );
    return res.json({ group });
  } catch (e) { next(e); }
};

export const summary = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const expenses = await Expense.find({ group: group._id }).sort({ createdAt: -1 });
    const balances = computeBalances(group.members, expenses);
    const settlements = simplifyDebts(group.members, balances);
    return res.json({ balances, settlements, members: group.members, expenses });
  } catch (e) { next(e); }
};
