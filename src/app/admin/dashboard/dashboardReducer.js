const dashBoardReducer = (state, action) => {
  const total = action?.payload?.data?.pagination?.total;
  const page = action?.payload?.data?.pagination?.page;
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        user: {
          page,
          total,
          list: action?.payload?.data?.users, 
        }
      }
    case "GET_CONTACT":
      return {
        ...state,
        contact: {
          page,
          total,
          list: action?.payload?.data?.contacts
        }
      }
      
    default:
      return state;
  }
};
const initialObj = {
  "user": {
    page: 0,
    total: 0,
    list: []
   },
   "contact": {
     page: 0,
     total: 0,
     list: []
    }
};

export {
  initialObj,
  dashBoardReducer
}