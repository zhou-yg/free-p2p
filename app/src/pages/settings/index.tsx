import React from 'react';
import {connect} from 'dva';


export default connect((state) => {
  console.log(state);
  
  return {
    ...state,
  };
})(function (props) {
  console.log(props);
  
  return (
    <div>
      settings.tsx
    </div>
  );
})
