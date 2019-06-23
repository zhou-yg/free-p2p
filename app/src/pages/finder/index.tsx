import React, {useEffect, useState} from 'react';

import {connect} from 'dva';

export default connect(state => state)(function (props) {
  let [s, setData] = useState(0);
  useEffect(() => {
    props.dispatch({
      type: 'finder/getFileList',
    })
  }, [s]);

  console.log(props)

  return (
    <div>
      {props.finder.files}
    </div>
  );
});
