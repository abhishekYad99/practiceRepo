// Strips the password hash before sending a user object to the client.
function toPublicUser(user) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

module.exports = { toPublicUser };
