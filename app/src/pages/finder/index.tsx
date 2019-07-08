import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import fileMangerRender from '../../fileManager/src/index';

export default connect(state => state)(function (props) {
  let [s, setData] = useState(0);
  useEffect(() => {

    fileMangerRender(document.querySelector('#finder'));
    
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
    <div id="finder">
      init
    </div>
  );
});
