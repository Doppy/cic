import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Upload, Icon, Modal, message } from 'antd';

const parseFileInfo = (file) => ({
  uid: file.publicId,
  name: file.fileName,
  status: 'done',
  url: file.url,
});

class PicturesWall extends Component {

  static propTypes = {
    multiple: PropTypes.bool,
    file: PropTypes.object,
    fileList: PropTypes.array,
  }

  static defaultProps = {
    multiple: false,
    action: process.env.REACT_APP_MEDIA_ENDPOINT,
  }

  // state = {
  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: [],
  // }

  constructor(props) {
    super(props);
    const fileList = _.compact(props.fileList || [props.file]);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: fileList ? _.map(fileList, file => parseFileInfo(file)) : [],
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const fileList = _.compact(nextProps.fileList || [nextProps.file]);
    if (fileList) {

      const fileListState = _.map(fileList, file => parseFileInfo(file));
      this.setState({
        fileList: fileListState,
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (event) => {
    // console.log('PicturesWall::handleChange', event);
    const status = event.file.status;
    if (status !== 'uploading') {
      console.log(event.file, event.fileList);
    }
    if (status === 'done') {
      message.success(`${event.file.name} file uploaded successfully.`);
      this.props.onChange(event, 'success');
    } else if (status === 'error') {
      message.error(`${event.file.name} file upload failed.`);
    }

    this.setState({ fileList: event.fileList });
  }

  render() {
    const { multiple, action } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          multiple={multiple}
          action={action}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
