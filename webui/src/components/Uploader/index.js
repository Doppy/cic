import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
const Dragger = Upload.Dragger;

class Uploader extends Component {

  defaultProps = {
    name: 'file',
    multiple: false,
    showUploadList: true,
  }

  state = {
    previewVisible: false,
    previewImage: '',
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (info) => {
    console.log('Uploader::handleChange', info);
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.props.onChange(info, 'success');
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.props.onChange(info, 'fail');
    }

  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    return (
      <div className="clearfix">
        <Dragger
          multiple
          showUploadList
          name="file"
          listType="picture"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          action={process.env.REACT_APP_MEDIA_ENDPOINT}
        >
          <p className="ant-upload-drag-icon" style={{ padding: 10 }}>
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
        </Dragger>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Uploader;
