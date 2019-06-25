import React, {useEffect, useState} from 'react';

import {connect} from 'dva';

export default connect(state => state)(function (props) {
  let [s, setData] = useState(0);
  useEffect(() => {
  }, [s]);

  function get () {
    props.dispatch({
      type: 'finder/getFileList',
    })
  }

  return (
    <div>
      {JSON.stringify(props.finder.files)}

      <button onClick={get}>getFileList</button>
    </div>
  );
});
