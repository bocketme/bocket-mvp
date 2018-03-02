/**
 * This function gives HTML code for the user's avatar, if avatarSrc i undefined it returns a default avatar with author's name
 * @param avatarSrc
 * @param author
 * @return {String}
 */
function getAvatar(avatarSrc, author) {
  let avatar;
  if (!avatarSrc)
    avatar = '<img data-name="' + author + '" class="avatar col s2 profile"/>';
  else
    avatar = '<img class=\"avatar col s2\" src=\"'+ avatarSrc +'">';
  return avatar
}
