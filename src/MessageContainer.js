import PropTypes from 'prop-types';
import React from 'react';

import {
  FlatList,
  View,
  StyleSheet,
} from 'react-native';

import * as utils from './utils';
import shallowequal from 'shallowequal';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.state = {
      messagesData: this.prepareMessages(props.messages)
    };
  }

  prepareMessages(messages) {
    return messages.map((currentMessage, i) => {
      const previousMessage = messages[i + 1] || {};
      const nextMessage = messages[i - 1] || {};
      return {
        currentMessage,
        previousMessage,
        nextMessage
      };
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    this.setState({
      messagesData: this.prepareMessages(nextProps.messages)
    })
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this.refs.flatListRef.scrollToOffset(options)
  }

  scrollToIndex(options) {
    this.refs.flatListRef.scrollToIndex(options)
  }

  renderRow({item}) {
    const {currentMessage, previousMessage, nextMessage} = item;
    if (!currentMessage._id && currentMessage._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!currentMessage.user) {
      if (!currentMessage.system) {
        console.warn("GiftedChat: `user` is missing for message", JSON.stringify(item));
      }
      currentMessage.user = {};
    }

    const messageProps = {
      ...utils.omit(this.props, ['messages']), // omit messages to prevent re-render of all message components
      key: currentMessage._id,
      currentMessage,
      previousMessage,
      nextMessage,
      position: currentMessage.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps}/>;
  }

  renderHeaderWrapper = () => {
    return <View style={styles.container}>{this.renderLoadEarlier()}</View>;
  };

  _keyExtractor = (item) => item.currentMessage._id;

  render() {
    return (
      <View
        ref='container'
        style={styles.container}
      >
        <FlatList
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}
          ref='flatListRef'
          keyExtractor={this._keyExtractor}
          inverted={true}
          {...this.props.listViewProps}

          data={this.state.messagesData}

          renderItem={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier()}
          {...this.props.invertibleScrollViewProps}
          ListFooterComponent={this.renderHeaderWrapper}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
};
