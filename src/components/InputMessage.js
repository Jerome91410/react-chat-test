import React, { Component } from 'react';
import PropTypes from 'prop-types';
import random from 'lodash/random';
import faker from 'faker';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { Input, message as messager, Switch } from 'antd';
import { sendMessage } from '../actions/chat';

const Writer = styled(Input.Search)``;

const Option = styled.div`
  margin-left: 25px;
`;
class InputMessage extends Component {
  static propTypes = {
    sendMessageLogic: PropTypes.func,
  };

  state = {
    fetchInitMessages: false,
    generateMessage: false,
    message: '',
  };

  componentDidMount() {
    const fetchInitMessages = localStorage.getItem('fetchInitMessages');
    if (fetchInitMessages) this.setState({ fetchInitMessages: true });
  }

  _addMessage = (text, nickname = 'you') => {
    const { sendMessageLogic } = this.props;
    sendMessageLogic({
      content: ` - ${text}`,
      from: nickname,
    });
  };

  _onSubmit = (text) => {
    const { sendMessageLogic } = this.props;
    if (!text) return messager.error('You must type something');
    sendMessageLogic({
      content: text,
    });
    return this.setState({ message: '' });
  };

  _onChange = ({ target: { value: message } }) => {
    this.setState({ message });
  };

  _generateMessage = (enable) => {
    if (this.intervalGenerator) clearInterval(this.intervalGenerator);
    this.setState({ generateMessage: !!enable });
    if (enable) {
      this._addMessage(faker.lorem.sentence(), faker.internet.userName());
      this.intervalGenerator = setInterval(() => {
        let content = faker.lorem.sentence();
        const nbSentence = random(0, 10);
        for (let j = 0; j < nbSentence; j += 1) {
          content += faker.lorem.sentence();
        }
        this._addMessage(content, faker.internet.userName());
      }, 200);
    }
  };

  _fetchInitMessages = (enable) => {
    this.setState({ fetchInitMessages: !!enable });
    if (enable) {
      return localStorage.setItem('fetchInitMessages', enable);
    }
    return localStorage.removeItem('fetchInitMessages');
  };

  render() {
    const { generateMessage, fetchInitMessages } = this.state;
    return (
      <div>
        <Writer
          placeholder="Send a message"
          enterButton="Send"
          size="large"
          value={this.state.message}
          onChange={this._onChange}
          onSearch={this._onSubmit}
        />
        <Option>
          Generator enabled:
          <Switch size="small" checked={generateMessage} onChange={this._generateMessage} />
        </Option>
        <Option>
          Fetch previous messages at init (reload expected):
          <Switch size="small" checked={fetchInitMessages} onChange={this._fetchInitMessages} />
        </Option>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendMessageLogic: (message) => dispatch(sendMessage(message)),
});

export default connect(
  null,
  mapDispatchToProps,
)(InputMessage);
