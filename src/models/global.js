const GlobalModel = {
  namespace: 'global',
  state: {
    // changeLayoutCollapsed
    collapsed: false,
    notices: [],
  },
  effects: {
  },
  reducers: {
    // changeLayoutCollapsed
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
  subscriptions: {
  },
};
export default GlobalModel;
