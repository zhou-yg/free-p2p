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
  function get2 () {
    props.dispatch({
      type: 'finder/getFile',
    })
  }

  return (
    <div>
      {JSON.stringify(props.finder.files)}
      <br/>
      {JSON.stringify(props.finder.fileData)}

      <hr/>

      <button onClick={get}>getFileList</button>
      <br/>

      <button onClick={get2}>getFileData</button>
    </div>
  );
});
