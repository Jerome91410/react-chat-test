import React, { Component } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import ListMessages from '../components/ListMessages';
import InputMessage from '../components/InputMessage';

const { Footer, Content } = Layout;

const MainLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const FooterContent = styled(Footer)`
  height: ${props => props.height};
`;

class Home extends Component {
  state = {
    mainLayoutHeight: 0,
  };

  componentDidMount() {
    if (this.mainRef && this.mainRef.clientHeight) {
      // specific code to handle the dynamic Height of the screen
      this.setState({ mainLayoutHeight: this.mainRef.clientHeight });
    }
  }

  render() {
    const { mainLayoutHeight } = this.state;
    // static footer's height definition
    const footerHeight = 130;
    return (
      <MainLayout
        ref={(el) => {
          this.mainRef = el;
        }}
      >
        {!mainLayoutHeight && <Content>Loading...</Content>}
        {mainLayoutHeight > 0 && <ListMessages listHeight={mainLayoutHeight - footerHeight} />}
        <FooterContent height={footerHeight}>
          <InputMessage />
        </FooterContent>
      </MainLayout>
    );
  }
}

export default Home;
