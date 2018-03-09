/**
 * This function gives HTML code for the user's avatar, if avatarSrc i undefined it returns a default avatar with author's name
 * @param avatarSrc
 * @param author
 * @param classes
 * @return {String}
 */
function getAvatar(avatarSrc, author, classes) {
  let avatar;
  if (!avatarSrc)
    avatar = '<img data-name="' + author + '" class=" avatar profile ' + classes + '"/>';
  else
    avatar = '<img class="avatar profile '+ classes +'" src=\"'+ avatarSrc +'">';
  return avatar
}
