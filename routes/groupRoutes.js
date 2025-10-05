import express from 'express';
import { body, param } from 'express-validator';
import { addMember, createGroup, deleteGroup, getGroup, listGroups, removeMember, renameGroup, summary, updateMember } from '../controller/groupController.js';

const groupRoutes = express.Router();

groupRoutes.post(
  '/',
  body('name').isString().trim().isLength({ min: 1 }),
  createGroup
);

groupRoutes.get('/', listGroups);

groupRoutes.get(
  '/:groupId',
  param('groupId').isMongoId(),
  getGroup
);

groupRoutes.patch(
  "/:groupId",
  param("groupId").isMongoId(),
  body("name").isString().trim().isLength({ min: 1 }),
  renameGroup
);

groupRoutes.delete(
  '/:groupId',
  param('groupId').isMongoId(),
  deleteGroup
);

groupRoutes.post(
  '/:groupId/members',
  param('groupId').isMongoId(),
  body('name').isString().trim().isLength({ min: 1 }),
  addMember
);

groupRoutes.patch(
  "/:groupId/members/:memberId",
  param("groupId").isMongoId(),
  param("memberId").isMongoId(),
  body("name").isString().trim().isLength({ min: 1 }),
  updateMember
);

groupRoutes.delete(
  '/:groupId/members/:memberId',
  param('groupId').isMongoId(),
  param('memberId').isMongoId(),
  removeMember
);

groupRoutes.get(
  '/:groupId/summary',
  param('groupId').isMongoId(),
  summary
);

export default groupRoutes;
