function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeBalances(members, expenses) {
  const net = {};
  for (const m of members) net[String(m._id)] = 0;

  for (const e of expenses) {
    if (!e.participants?.length) continue;
    const share = e.amount / e.participants.length;
    net[e.paidBy] = round2((net[e.paidBy] ?? 0) + e.amount);
    for (const pid of e.participants) {
      net[pid] = round2((net[pid] ?? 0) - share);
    }
  }
  return net;
}

function simplifyDebts(members, balances) {
  const creditors = [];
  const debtors = [];
  for (const m of members) {
    const id = String(m._id);
    const v = balances[id] ?? 0;
    if (v > 0.009) creditors.push({ id, amt: v });
    else if (v < -0.009) debtors.push({ id, amt: -v });
  }
  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);

  const tx = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    tx.push({ from: debtors[i].id, to: creditors[j].id, amount: round2(pay) });
    debtors[i].amt = round2(debtors[i].amt - pay);
    creditors[j].amt = round2(creditors[j].amt - pay);
    if (debtors[i].amt <= 0.009) i++;
    if (creditors[j].amt <= 0.009) j++;
  }
  return tx;
}

export { computeBalances, simplifyDebts };
