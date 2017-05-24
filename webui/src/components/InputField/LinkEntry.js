import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Select, Spin, Tag } from 'antd';
const Option = Select.Option;

import * as EntryActions from '../../actions/entries';
import { getActiveSpaceFromId, getSpaceEntriesFromSpaceId } from '../../selectors';

class LinkSelect extends Component {

  static propTypes = {
    spaceId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  }

  componentDidMount() {
    const { space, getEntryInSpace } = this.props;
    getEntryInSpace(space._id);
  }

  handleChange = (key) => {
    this.props.onChange({ type: 'Link', linkType: 'Entry', _id: key });
  }

  render() {
    const { value, space, entries } = this.props;
    console.log('LinkEntry::field', this.props);
    // const entryWithContentType = _.map(entries, entry => {
    //   return { ...entry, contentType: _.find(space.contentTypes, ct => ct._id === entry.contentTypeId) };
    // });
    const { fetching, data } = this.state;

    return (
      <Select
        size="large"
        value={value._id}
        placeholder="Select Entry"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
      >
        {entries.map((entry, index) =>
          <Option key={entry._id}>
            <Tag color="green">{entry.contentType.name}</Tag> {_.get(entry, `fields.${entry.contentType.displayField}`)}
          </Option>)}
      </Select>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  const linkContentType = _.get(ownProps, 'field.src.validations.linkContentType', []);

  // Get All Entries
  const allEntries = getSpaceEntriesFromSpaceId(state, ownProps.spaceId);

  // Get Space
  const space = getActiveSpaceFromId(state, ownProps.spaceId);

  // Attach ContentType to Entry
  const entryWithContentType = _.map(allEntries, entry => {
    return { ...entry, contentType: _.find(space.contentTypes, ct => ct._id === entry.contentTypeId) };
  });

  // Filter Entries by linkContentType
  let filteredEntries;
  if (linkContentType.length > 0) {
    filteredEntries = _.filter(entryWithContentType, entry => {
      return _.includes(linkContentType, entry.contentType.identifier);
    });
  } else {
    filteredEntries = allEntries;
  }

  return {
    value: ownProps.value,
    space: getActiveSpaceFromId(state, ownProps.spaceId),
    entries: filteredEntries,
  };
}
const actions = {
  getEntryInSpace: EntryActions.getEntryInSpace,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkSelect);
