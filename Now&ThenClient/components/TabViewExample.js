import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import ProjectTab from './ProjectTab';
import landscape from '../assets/images/landscape.jpg';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = () => <ProjectTab image={landscape} photos="27" date="October 14, 2017" />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      backgroundColor: '#F93943',
    }
  });

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'My Landscapes' },
      { key: '2', title: 'Second' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => (
    <TabBar 
      {...props}
      style={styles.tabBar} />
  );

  _renderScene = SceneMap({
    1: FirstRoute,
    2: SecondRoute,
  });

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}