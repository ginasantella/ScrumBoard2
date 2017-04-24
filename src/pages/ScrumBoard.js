import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  ListView,
  View,
  TextInput,
  ScrollView,
  AppRegistry,
  AlertIOS,
  NavigatorIOS,
  Image, 
  TouchableHighlight, 
  Animated,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import Panel from '../components/Panel';
import Home from './Home';
import navigator from './Navigation';
import ListItem from '../components/ListItem';
import config from '../../config';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import AddPBL from './AddPBL';
const StatusBar = require('../components/StatusBar');
//var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

export default class ScrumBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
              username: this.props.username,
              projectName: this.props.projectName,
              projectKey: this.props.projectKey,
              dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              loaded: false,
        };
        this.productBacklogRef = this.getRef().child('prodBacklogs');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

  componentDidMount() {
    this.renderProductBacklog();
   }

    renderProductBacklog(){
    var correctProjectKey = this.state.projectKey;
    this.productBacklogRef.on("value", (snapshot) => {
    var productBacklog =[];
    snapshot.forEach((child) => { //each product backlog item
      var childVal = child;
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          var itemList = data.val();
          var AC = '';
          var desc = '';
          var estimate = '';
          var userStory = '';
          if(itemName=='acc'){
            AC = itemList;
          }
          if(itemName=='descrpition'){
            desc = itemList;
          }
          if(itemName=='estimate'){
            estimate = itemList;
          }
          if(itemName=='userStory'){
            userStory = itemList;
          }
          if(itemName=='project'){
            console.log("^^^^^^^^^^^^^^^^^^^^^INSIDE PROJECTS");
                if(itemList==correctProjectKey){
                  console.log("ITEM LIST: " + itemList);
                  console.log("CORRECT PROJECT KEY: " + correctProjectKey);
                  console.log('WORKS!!!!!!!');
                      productBacklog.push({
                          title: userStory,
                          _key: itemName,
                          
                      });
                }
          }
        });    
      });
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(productBacklog)
    });
  });
}


    toAddPL = () =>{
      var correctProjectName=this.state.projectName;
      var correctUserName=this.state.username;
    var correctProjectKey = this.state.projectKey;
    this.props.navigator.push({
      title: 'Add New Project Item',
     component: AddPBL,
      passProps:{
          username: correctUserName,
          projectName: correctProjectName,
          projectKey:correctProjectKey,
      }
    });
  }

    render() {
      // if(!this.state.loaded){
      //   return this.renderProductBacklog();
      // }
    return ( 
      <ScrollView style={styles.scroll}>
        <Container>
            <StatusBar title={this.state.projectName + " Scrum Board"} />
          </Container>
    

               <Container>
                    <Button 
                        label="Add New Project Item"
                       styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                       navigator={this.props.navigator}
                        onPress={this.toAddPL.bind(this)} />
                </Container>
           

               {/*<Container>
                    <Button 
                        label="RENDER"
                       styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                       navigator={this.props.navigator}
                        onPress={this.renderProductBacklog.bind(this)} />
                </Container>*/}

        <Panel title="Product Backlog" onPress={this.renderProductBacklog.bind(this)}>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderProductBacklog.bind(this)}

          style={styles.listview}/>
        </Panel>
        <Panel title="Sprint Backlog">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderSprintBacklog.bind(this)}

          style={styles.listview}/>
        </Panel>
        <Panel title="To Do">
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderToDoTasks.bind(this)}

          style={styles.listview}/>
        </Panel>
        <Panel title="In Progress">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderInProgressTasks.bind(this)}
          style={styles.listview}/>
        </Panel>
        <Panel title="Done">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderDoneTasks.bind(this)}

          style={styles.listview}/>
        </Panel>
   
        
      </ScrollView>
    );
  }



  renderSprintBacklog(item){
  
  }
  
  renderToDoTasks(item){
  
  }

  renderInProgressTasks(item){
  
  }

  renderDoneTasks(item){
  
  }
}

AppRegistry.registerComponent('Panels', () => ScrumBoard);


var styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : '#f4f7f9',
    paddingTop      : 30
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#4169E1',
    paddingHorizontal: 5,
    paddingVertical: 10
},

container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
listview: {
    flex: 1,
  },
  buttonWhiteText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "500",
    textAlign: 'center',
    fontFamily: "Helvetica"
},
primaryButton: {
    backgroundColor: '#4169E1',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
},
menuTrigger: {
   flexDirection: 'row',
   paddingHorizontal: 10
   },
menuTriggerText: {
   color: '#E1D7D8',
   fontWeight: '600',
   fontSize: 20
   },
disabled: {
   color: '#ccc'
   },
divider: {
   marginVertical: 5,
   marginHorizontal: 2,
   borderBottomWidth: 1,
   borderColor: '#ccc'
   },
content: {
   backgroundColor: '#E1D7D8',
   padding: 50,
   flexDirection: 'column'                                 },
   contentText: {
   fontSize: 18
   },
scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
});

