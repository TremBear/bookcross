const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  sideItem: state => state.user.sideItem,
  labelList: state => state.user.labelList,
  labelId: state => state.user.labelId,
  dictLabels: state => state.user.dictLabels,
  navType: state => state.user.navType,
  userIsClass: state => state.user.userIsClass
}
export default getters
