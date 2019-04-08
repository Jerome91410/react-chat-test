import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  List, AutoSizer, CellMeasurer, CellMeasurerCache,
} from 'react-virtualized';
import { findIndex } from 'lodash';
import styled from 'styled-components';
import { Spin } from 'antd';
import { fetchMessages } from '../actions/chat';

const EmptyRow = styled.div``;

const Info = styled.div`
  width: 200px;
`;

let _maxHeight = 0;
let _listHeight = 0;
const ListBox = styled(List)`
  border: 1px solid #e0e0e0;
  background-color: #fff;
  flex: 1;
  padding-top: ${() => (_listHeight - _maxHeight > 0 ? _listHeight - _maxHeight : 0)}px;
`;

const Loading = styled.div`
  display: inline-block;
  position: relative;
  left: 50%;
  margin: 10px;
`;

const Message = styled.div`
  flex: 1;
  overflow: scroll;
  z-index: 10;
`;

const Nickname = styled.div`
  width: 150px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: initial;
  background-color: #fff;
  border-top: 1px solid #b9aeae;
  font-weight: ${props => (props.fromYou ? 'bold' : 'normal')};
`;

class ListMessages extends Component {
  static propTypes = {
    fetchingMessages: PropTypes.bool,
    fetchMessageLogic: PropTypes.func,
    infiniteLoadingPercent: PropTypes.number,
    listHeight: PropTypes.number,
    messages: PropTypes.array,
    rowHeight: PropTypes.number,
  };

  state = {
    autoScroll: true,
    lastVisible: 0,
    list: [],
    minListSize: 0,
    scrollToIndex: undefined,
  };

  static defaultProps = {
    infiniteLoadingPercent: 0.2,
    listHeight: 600,
    rowHeight: 30,
  };

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    const { autoScroll, lastVisible, minListSize } = this.state;
    if (messages.length !== prevProps.messages.length) {
      let lastIdx;
      if (lastVisible) {
        lastIdx = findIndex(messages, o => o.createdAt === lastVisible);
        lastIdx += minListSize;
      }
      this.setState({
        scrollToIndex: autoScroll ? messages.length - 1 : lastIdx,
        list: messages,
      });
    }
  }

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  });

  _rowRenderer = ({
    index, parent, key, style,
  }) => {
    const { list } = this.state;
    const {
      content, type, createdAt, from,
    } = list[index];
    let row;
    if (type === 'spacer') {
      row = <EmptyRow key={key} style={style} />;
    } else {
      row = (
        <Row style={style} fromYou={from === 'you'}>
          <Info>{createdAt.slice(0, 19)}</Info>
          <Nickname>{from}</Nickname>
          <Message>{content}</Message>
        </Row>
      );
    }
    if (style.top + style.height > _maxHeight) {
      _maxHeight = style.top + style.height;
      // FIXME: Better way expected
      setTimeout(() => this.forceUpdate(), 500);
    }
    return (
      <CellMeasurer key={key} cache={this._cache} parent={parent} columnIndex={0} rowIndex={index}>
        {row}
      </CellMeasurer>
    );
  };

  _onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const { autoScroll, list } = this.state;
    const {
      rowHeight, fetchMessageLogic, infiniteLoadingPercent, listHeight,
    } = this.props;

    const isScrolled = scrollHeight - scrollTop - clientHeight > rowHeight;
    if (clientHeight && !autoScroll && !isScrolled) {
      // enable autoScroll due to last displayed === last received
      this.setState({ autoScroll: true });
    }
    if (clientHeight && autoScroll && isScrolled) {
      // disable autoScroll because the user is reading an old message
      this.setState({ autoScroll: false });
    }
    if (scrollTop < listHeight * infiniteLoadingPercent) {
      const before = list[0] ? list[0].createdAt : undefined;
      // fetch data before the first message if activated
      const fetchMessagesFromInit = localStorage.getItem('fetchInitMessages');
      if (fetchMessagesFromInit || before) {
        fetchMessageLogic({ before, nb: 50 });
        this.setState({ lastVisible: before });
        // Force CellMeasurerCache to recalcul the previous index
        if (this._cache) this._cache.clearAll();
      }
    }
  };

  render() {
    const { scrollToIndex, list } = this.state;
    const { fetchingMessages } = this.props;
    return (
      <div style={{ flex: '1 1 auto' }}>
        <AutoSizer>
          {({ width, height }) => (
            <ListBox
              ref={(ref) => {
                this.listBoxRef = ref;
                if (_listHeight !== height) _listHeight = height;
              }}
              height={height}
              deferredMeasurementCache={this._cache}
              rowCount={list.length}
              rowHeight={this._cache.rowHeight}
              rowRenderer={this._rowRenderer}
              width={width}
              scrollToIndex={scrollToIndex}
              onScroll={this._onScroll}
            />
          )}
        </AutoSizer>
        {fetchingMessages && (
          <Loading>
            <Spin />
          </Loading>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.chat.messages,
  fetchingMessages: state.chat.fetchingMessages,
});

const mapDispatchToProps = dispatch => ({
  fetchMessageLogic: message => dispatch(fetchMessages(message)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListMessages);
