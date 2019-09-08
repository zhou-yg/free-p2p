import React, { Component } from 'react';
import { connect } from 'react-redux';
import File from '../File/File.jsx';
import FileListEmptyMessage from './FileListEmptyMessage';
import Loader from '../Loader/Loader.jsx';
import './FileList.css';

class FileList extends Component {
    render() {
        const { fileList, loading, error } = this.props;

        const fileListComponent = fileList.map((file, key) => {
            return <File type={file.type} name={file.name} editable={file.editable} size={file.size} key={key} />
        });

        return <div className="FileList">
            { loading ? <Loader /> :
                error ? error.message :
                fileListComponent.length ? fileListComponent :
                  <FileListEmptyMessage />
            }
        </div>
    }
}


const mapStateToProps = (state) => {
    const filteredList = state.fileList.filter(
        file => state.fileListFilter ? file.name.toLocaleLowerCase().match(state.fileListFilter.toLocaleLowerCase()) : true
    );
    return {
        fileList: filteredList,
        loading: state.loading,
        error: state.error,
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        handleClick: (event) => {
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
