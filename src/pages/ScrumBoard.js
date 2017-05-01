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

import Accordion from 'react-native-accordion';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import Panel from '../components/Panel';
import Home from './Home';
import navigator from './Navigation';
import config from '../../config';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import AddPBL from './AddPBL';
import EditPBL from './EditPBL'
import ListItem from '../components/ListItem';
import AddTask from './AddTask';
const StatusBar = require('../components/StatusBar');
//var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

export default class ScrumBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
              username: this.props.username,
              role: this.props.role,
              projectName: this.props.projectName,
              projectKey: this.props.projectKey,
              productBacklog:[],
              sprintBacklog:[],
              dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              sprintDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              loaded: false
        };
        this.productBacklogRef = this.getRef().child('prodBacklogs');
        this.projectsRef= this.getRef().child('projects');
        this.usersRef= this.getRef().child('users');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

  componentDidMount() {
    this.updateProductBacklog();
   }

   updateProductBacklog(){
    var correctProjectKey = this.state.projectKey;
    console.log("$%^&*() Project key is: " + correctProjectKey + " $%^&*()");
    this.productBacklogRef.on("value", (snapshot) => {
      var thisProductBacklog =[];
      var thisSprintBacklog =[];
      snapshot.forEach((child) => { //each product backlog item
      var childVal = child;
      var AC = '';
      var desc = '';
      var estimate = '';
      var userStory = '';
      var status = '';
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          console.log("$$$ Key is: " + itemName + " $$$");
          var itemList = data.val();
          console.log("$$$ Val is: " + itemList + " $$$");
          
          if(itemName=='acc'){
            AC = itemList;
          }
          else if(itemName=='description'){
            desc = itemList;
          }
          else if(itemName=='estimate'){
            estimate = itemList;
          }
          else if(itemName=='_userStory'){
            userStory = itemList;
            console.log('CORRECT User story is: ' + userStory);

          }
          else if(itemName=='location'){
            status = itemList;
            console.log("STATUS IS: " + status);

          }
          else if(itemName=='project'){
            console.log("^^^^^^^^^^^^^^^^^^^^^INSIDE PROJECTS");
                if(itemList==correctProjectKey){
                  console.log("ITEM LIST: " + itemList);
                  console.log("CORRECT PROJECT KEY: " + correctProjectKey);
                  console.log('WORKS!!!!!!!');
                  console.log('User story is: ' + userStory);
                  console.log('Item name is: ' + itemName);
                  console.log("$$$ THIS STATUS IS: " + status);
                  if(status=='productBacklog'){
                      thisProductBacklog.push({
                          title: userStory,
                          _key: itemList,
                          ac: AC,
                          des: desc,
                          est: estimate,
                          us: userStory, 
                          stat: status,  
                      });
                }
                else if(status=='sprintBacklog'){
                  thisSprintBacklog.push({
                          title: userStory,
                          _key: itemList,
                          ac: AC,
                          des: desc,
                          est: estimate,
                          us: userStory, 
                          stat: status,  
                      });
                }
                }
          }
        });    
      });
      thisProductBacklog.forEach((child) => {
        console.log("Child key is: " + child.title);
        console.log("Child val is: " + child._key);
      });
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(thisProductBacklog),
          sprintDataSource: this.state.sprintDataSource.cloneWithRows(thisSprintBacklog),
          productBacklog: thisProductBacklog,
          sprintBacklog: thisSprintBacklog,
    });
    
 
    console.log("DING DING DING");
    this.state.productBacklog.forEach((child) => {
        console.log("PB key is: " + child.title);
        console.log("PB val is: " + child._key);
      });
    });
}
toAddPL = () =>{
       var correctProjectName=this.state.projectName;
      var correctUserName=this.state.username;
      var correctRole = "";
      var done = false;
    var exists = false;
    var once =false;
    var second=false;
     
    var correctProjectKey = this.state.projectKey;


    this.usersRef.on("value", (snapshot) => {
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                    done = true; 
       this.projectsRef.on("value", (snapshot) => {
      //       //done = false;
             snapshot.forEach((child) => {

                var childKey = child.key;
                            if(childKey==correctProjectKey){
                                child.forEach(function(data)  {
                                     var itemName = data.key;
                                    if(itemName=='users'){
                                      
                                        data.forEach(function(data1){
                                       var userID = data1.key;
                                        
                                          if(userID==correctUserName && once!=true){
                                            //correctRole=[correctUserName]._role;
                                            data1.forEach(function(data2){
                                              correctKey=data2.key;
                                              if(correctKey=="_role"){
                                                correctRole=data2.val();
                                              console.log("####################"+correctRole);
                                              
                                              }
                                              
                                            });
                                             
                                                     exists = true;
                                             }
                                        });
                                         if(!exists && once!=true){
                                            if(itemName=='users' && once!=true){
                                            once=true;
                                            correctRole=[correctUserName]._role;
                                             console.log("####################2"+itemName);
                                           }
                                         }
                                    }
                                
                                 });
                            }
            
            });
      
        });
            }
        });
    });
      
    
     

  if(correctRole == "Product Owner"){
    this.props.navigator.push({
      title: 'Add New Project Item',
     component: AddPBL,
      passProps:{
          role: correctRole,
          username: correctUserName,
          projectName: correctProjectName,
          projectKey:correctProjectKey,
      }
    });}
 else{
      AlertIOS.alert(
                             'Error!',
                             'Only the product owner can add to the product backlog!',
                             [
                             {text: 'Okay', onPress: () => this.props.navigator.push({
                                     title: 'Scrum Board',
                                     component: ScrumBoard,
                                     passProps:{
                                      role: correctRole,
           username: correctUserName,
           projectName: correctProjectName,
           projectKey:correctProjectKey,}
                                   
                    }), style: 'cancel'},
                        ]
                             );
 }
  }

  toEditPL = () =>{
   var correctProjectName=this.state.projectName;
      var correctUserName=this.state.username;
      var correctRole = "";
      var done = false;
    var exists = false;
    var once =false;
    var second=false;
     
    var correctProjectKey = this.state.projectKey;


    this.usersRef.on("value", (snapshot) => {
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                    done = true; 
       this.projectsRef.on("value", (snapshot) => {
      //       //done = false;
             snapshot.forEach((child) => {

                var childKey = child.key;
                            if(childKey==correctProjectKey){
                                child.forEach(function(data)  {
                                     var itemName = data.key;
                                    if(itemName=='users'){
                                      
                                        data.forEach(function(data1){
                                       var userID = data1.key;
                                        
                                          if(userID==correctUserName && once!=true){
                                            //correctRole=[correctUserName]._role;
                                            data1.forEach(function(data2){
                                              correctKey=data2.key;
                                              if(correctKey=="_role"){
                                                correctRole=data2.val();
                                              console.log("####################"+correctRole);
                                              
                                              }
                                              
                                            });
                                             
                                                     exists = true;
                                             }
                                        });
                                         if(!exists && once!=true){
                                            if(itemName=='users' && once!=true){
                                            once=true;
                                            correctRole=[correctUserName]._role;
                                             console.log("####################2"+itemName);
                                           }
                                         }
                                    }
                                
                                 });
                            }
            
            });
      
        });
            }
        });
    });
      
    
     

  if(correctRole == "Product Owner"){
    this.props.navigator.push({
      title: 'Edit Project Item',
     component: EditPBL,
      passProps:{
          role: correctRole,
          username: correctUserName,
          projectName: correctProjectName,
          projectKey:correctProjectKey,
      }
    });}
 else{
AlertIOS.alert(
                             'Error!',
                             'Only the product owner can edit the product backlog!',
                             [
                             {text: 'Okay', onPress: () => this.props.navigator.push({
                                     title: 'Scrum Board',
                                     component: ScrumBoard,
                                     passProps:{
                                      role: correctRole,
           username: correctUserName,
           projectName: correctProjectName,
           projectKey:correctProjectKey,}
                                   
                    }), style: 'cancel'},
                        ]
                             );
}

  }

  toAddTask = () => {
    var correctProjectName=this.state.projectName;
    var correctUserName=this.state.username;
    var correctProjectKey = this.state.projectKey;
    this.props.navigator.push({
    title: 'Add Project Task Item',
    component: AddTask,
    passProps:{
        username: correctUserName,
        projectName: correctProjectName,
        projectKey: correctProjectKey,
    }
    });

  }
   

    render() {
      // if(!this.state.loaded){
      //   return this.renderProductBacklog();
      // }
      var textInfo = '';
    this.state.productBacklog.forEach((child) => {
        textInfo = child.title;
      });    
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
                 <Container>
                    <Button 
                        label="Edit New Project Item"
                       styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                       navigator={this.props.navigator}
                        onPress={this.toEditPL.bind(this)} />
                </Container>
                <Container>
                    <Button 
                        label="Add a Project Task"
                       styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                       navigator={this.props.navigator}
                        onPress={this.toAddTask.bind(this)} />
                </Container>
                   {/*<Container>
                    <Button 
                        label="RENDER"
                       styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                       navigator={this.props.navigator}
                        onPress={this.renderProductBacklog.bind(this)} />
                </Container>*/}
                 {/*onPress={this.renderProductBacklog.bind(this)}*/}

        {/*<Panel title="Product Backlog" dataSource={this.state.dataSource}>*/}
          <Container>
       <Label text={"Product Backlog"} />
                <View style={{ flex: 1 }}>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          style={styles.listview}/>
          </View>
          </Container>
          <Container>
       <Label text={"Sprint Backlog"} />
    <View style={{ flex: 1 }}>
       <ListView
          dataSource={this.state.sprintDataSource}
          renderRow={this._renderItem.bind(this)}/>
          </View>
          </Container>
        <Container>
       <Label text={"To Do"} />
        </Container>
        <Container>
       <Label text={"In Progress"} />
        </Container>
        <Container>
       <Label text={"Done"} />
        </Container>
          {/*<Text onPress={() => this._renderItem(this)}>{textInfo}</Text>*/}
        {/*</Panel>*/}
        {/*<Panel title="Sprint Backlog">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderSprintBacklog.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>
        </Panel>*/}
        {/*<Panel title="To Do">
        <ListView
        </Panel>
        <Panel title="To Do">
                    <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderToDoTasks.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>
        </Panel>*/}
        {/*<Panel title="In Progress">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderInProgressTasks.bind(this)}
          style={styles.listview}/>
        </Panel>*/}
        {/*<Panel title="Done">
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderDoneTasks.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>
        </Panel>*/}
   
        </ScrollView>

    );
  }
_renderItem(item) {
      //var correctUserName = this.state.username;
      //var correctProjectName = item.title;
      //var correctProjectKey = item.projectKey;
    
    const onPress = () => {
      var desc = ''
      if(item.des!=false){
        desc = item.des;
      }
      AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est ,
        null,
        [
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }



  // renderSprintBacklog(item){
  
  // }
  
  // renderToDoTasks(item){
  
  // }

  // renderInProgressTasks(item){
  
  // }

  // renderDoneTasks(item){
  
  // }
}
module.exports = ScrumBoard;
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

