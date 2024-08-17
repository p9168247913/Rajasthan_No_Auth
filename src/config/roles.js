const roles = ['device', 'IRM', 'district', 'admin', 'super-admin'];
const adminRoles = ['admin', 'super-admin']; 

const roleRights = new Map();
roleRights.set(roles[0], ['device'])
roleRights.set(roles[1], ['device', 'district', 'IRM'])
roleRights.set(roles[2], ['district'])
roleRights.set(roles[3], ['device', 'IRM', 'district', 'admin'])
roleRights.set(roles[4], ['district', 'admin', 'super-admin'])

module.exports = {
  roles,
  roleRights,
  adminRoles,
};