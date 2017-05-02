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

//import Accordion from 'react-native-accordion';
 
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
 var correctAc;
 var correctDesc;
 var correctEstimate;
 var correctUserStory;
 var correctLocation;

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
              toDoTasks:[],
              dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              sprintDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              toDoDataSource: new ListView.DataSource({
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
      var thisToDoTasks = [];
      snapshot.forEach((child) => { //each product backlog item
      var childVal = child;
      var AC = '';
      var desc = '';
      var estimate = '';
      var userStory = '';
      var status = '';
      var projectValue ='';
      var userStoryKeyValue = child.key;
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
            projectValue = itemList;
                if(projectValue==correctProjectKey){
                  console.log("ITEM LIST: " + itemList);
                  console.log("CORRECT PROJECT KEY: " + correctProjectKey);
                  console.log('WORKS!!!!!!!');
                  console.log('User story is: ' + userStory);
                  console.log('Item name is: ' + itemName);
                  console.log("$$$ THIS STATUS IS: " + status);
                  if(status=='productBacklog'){
                    if(userStory == ""){
                          thisProductBacklog.push({
                          title: desc,
                          _key: itemList,
                          ac: AC,
                          des: desc,
                          est: estimate,
                          us: userStory, 
                          stat: status, 
                      });
                    }
                    else{
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
                }
                else if(status=='sprintBacklog'){
                  if(userStory == ""){
                    thisSprintBacklog.push({
                            title: desc,
                            _key: itemList,
                            ac: AC,
                            des: desc,
                            est: estimate,
                            us: userStory, 
                            stat: status,
                            userStoryKey: userStoryKeyValue,   
                      });
                  }
                  else{
                    thisSprintBacklog.push({
                            title: userStory,
                            _key: itemList,
                            ac: AC,
                            des: desc,
                            est: estimate,
                            us: userStory, 
                            stat: status,
                            userStoryKey: userStoryKeyValue,   
                      });
                  }
                }
                }
          }
          else if(itemName =='tasks'){
            if(projectValue==correctProjectKey){
            var taskStatus = '';
            var percentage = '';
            var assignedMember = '';
            var description = '';
            data.forEach(function(data2)  {
              var taskKey = data.key;

              data2.forEach(function(data3){
                var taskName = data3.key;
                var taskValue = data3.val();
                console.log("######$$$$$$$$$$$$ Task Name: " + taskName);
                console.log("######$$$$$$$$$$$$ Task Value: " + taskValue);
                if(taskName == '_description'){
                  description = taskValue;
                }
                else if(taskName == 'assignedMember'){
                  assignedMember = taskValue;
                }
                else if(taskName == "percentage"){
                  percentage = taskValue;
                }
                else if(taskName == 'status'){
                  taskStatus = taskValue;
                if(taskStatus =='ToDo'){
                  console.log("^^^^^^^^^^^^^^INSIDE TO DO LOOP");
                  console.log("******Desc: " + description);
                  console.log("********Member assigned: " + assignedMember);
                  var newDesc = "1. " + description;
                  thisToDoTasks.push({
                    title: newDesc,
                    key: taskKey,
                    percent: percentage,
                    desc: description,
                    memb: assignedMember,
                    stat: taskStatus,
                    us: userStory,
                });
              }
                }
              });
            });
          }
          }
        });    
      });
      var newestPBL = [];
            for(i = (thisProductBacklog.length)-1; i>=0; i--){
            thisProductBacklog.forEach((child) => {
              // console.log("Child key is: " + child.title);
              // console.log("Child val is: " + child._key);
              if(child.priority==i){
                newestPBL.push({
                  title: child.title,
                  _key: child._key,
                  ac: child.ac,
                  des: child.des,
                  est: child.est,
                  us: child.us,
                  stat: child.stat,
                  priority: child.priority,
              });
              }
            });
      }
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(thisProductBacklog),
          sprintDataSource: this.state.sprintDataSource.cloneWithRows(thisSprintBacklog),
          toDoDataSource: this.state.toDoDataSource.cloneWithRows(thisToDoTasks),
          productBacklog: thisProductBacklog,
          sprintBacklog: thisSprintBacklog,
          toDoTasks: thisToDoTasks,
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
    console.log("???????????????????METHOOOOD");
   var correctProjectName=this.state.projectName;
      var correctUserName=this.state.username;
      var correctRole = this.state.role;
      var done = false;
    var exists = false;
    var once =false;
    var second=false;
     
    var correctProjectKey = this.state.projectKey;
    if(correctEstimate==""){
      correctEstimateVal=0;
    }
     if(correctEstimate=="S"){
      correctEstimateVal=1;
    }
     if(correctEstimate=="M"){
      correctEstimateVal=2;
    }
     if(correctEstimate=="L"){
      correctEstimateVal=3;
    }
     if(correctEstimate=="XL"){
      correctEstimateVal=4;
    }

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
    var currentPriority;
     

    this.props.navigator.push({
      title: 'Edit Project Item',
     component: EditPBL,
      passProps:{
          role: correctRole,
          username: correctUserName,
          projectName: correctProjectName,
          projectKey:correctProjectKey,
          ac: correctAc,
          description: correctDesc,
          estimateVal: correctEstimateVal,
          location: correctLocation,
          userStory: correctUserStory,
          priority: currentPriority,
         
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
          enableEmptySections={true}
          renderRow={this._renderItem.bind(this)}
          style={styles.listview}/>
          </View>
          </Container>
          <Container>
       <Label text={"Sprint Backlog"} />
    <View style={{ flex: 1 }}>
       <ListView
          dataSource={this.state.sprintDataSource}
          enableEmptySections={true}
          renderRow={this._renderSprintItem.bind(this)}
          style={styles.listview}/>
          </View>
          </Container>
        <Container>
       <Label text={"To Do"} />
           <View style={{ flex: 1 }}>
          <ListView
            dataSource={this.state.toDoDataSource}
            enableEmptySections={true}
            renderRow={this._renderToDoTasks.bind(this)}
            style={styles.listview}/>
          </View>
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
    this.toEditPL=this.toEditPL.bind(this);
    const onPress = () => {
      var desc = ''
      if(item.des!=false){
        desc = item.des;
        correctDesc = desc;
        correctAc = item.ac;
        correctEstimate = item.est;
        correctUserStory = item.us; 
        correctLocation = item.status;
      }
      AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est ,
        null,
        [
          {text: 'Move Item Up', onPress: (text) => this.moveUp(item)},
          {text: 'Move Item Down', onPress: (text) => this.moveDown(item)},
          {text: 'Edit Product Backlog', onPress: this.toEditPL},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

  moveDown(item){
    //check if in last position or only item
    var productBacklog = this.state.productBacklog;
    var currentPriority = item.priority;
    var targetPriority = ((currentPriority)-1);
    console.log("currentPriority is: " + currentPriority);
    console.log("targetPriority is: " + targetPriority);
    var targetUS = item.us;
    var targetAC = item.ac;
    console.log("In Move Down Function");
    console.log("PBL size is: " + productBacklog.length);
    console.log("Item priority is: " + currentPriority);
    if(productBacklog.length==1){
      //only item
      AlertIOS.alert(
        'There is only one item',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else if(item.priority==0){
      //last position
      console.log("MOVE DOWN, ALREADY IN LAST POSITION");
      AlertIOS.alert(
        'Item is already in last position',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else{
      //move item
      //find item with priority-1
      //set its priority to plus one
      //set this priority to minus one
      var correctProjectKey = this.state.projectKey;
      var first = false;
      var second = false;
      var third = false;
      this.productBacklogRef.on("value", (snapshot) => {
      var done = false;
      snapshot.forEach((child) => { //each product backlog item
      var thisPriority='';
      var proj = '';
      var loc = '';
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          var itemList = data.val();
          if(itemName=='key'){
            proj = itemList;
          }
          else if(itemName=='location'){
            loc = itemList;
          }
          else if(itemName=='priority'){
            thisPriority = itemList;
            if(proj==correctProjectKey && loc=='productBacklog'){
              //items are a match.
              if(thisPriority==currentPriority){
              console.log("THIS: " + thisPriority);
              console.log("TARGET: " + targetPriority);
              console.log("CURRENT: " + currentPriority);
              if(!first){
                console.log("First updated");
                    first=true;
                    // thisPriority='temp';
                    child.ref.update({
                       priority:'temp',
                    });
              }
              }
              else if(thisPriority==targetPriority){
                console.log("THIS: " + thisPriority);
                console.log("TARGET: " + targetPriority);
                console.log("^^^^^^^^^^^^^^^CURRENT PRIORITY: " + currentPriority);
                if(!second){
                   console.log("Second updated");
                    second=true;
                    // thisPriority=(currentPriority);
 
                    child.ref.update({
                       priority:currentPriority,
                    });
                }
              }
             else if(thisPriority=='temp'){
              console.log("THIS: " + thisPriority);
              console.log("TARGET: " + targetPriority);
              console.log("CURRENT: " + currentPriority);
              if(!third){
                console.log("Third updated");
                    third=true;
                    // thisPriority=targetPriority;
                    child.ref.update({
                       priority:targetPriority,
                    });
              }
                   
             }    
            }
          }
            });
          });
      });
      }
  }
 
  moveUp(item){
    //check if in last position or only item
    var productBacklog = this.state.productBacklog;
    var currentPriority = item.priority;
    var targetPriority = ((currentPriority)+1);
    console.log("currentPriority is: " + currentPriority);
    console.log("targetPriority is: " + targetPriority);
    var targetUS = item.us;
    var targetAC = item.ac;
    console.log("In Move Up Function");
    console.log("PBL size is: " + productBacklog.length);
    console.log("Item priority is: " + currentPriority);
    if(productBacklog.length==1){
      //only item
      AlertIOS.alert(
        'There is only one item',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else if(item.priority==((productBacklog.length)-1)){
      //first position
      console.log("MOVE UP, ALREADY IN FIRST POSITION");
      AlertIOS.alert(
        'Item is already in first position',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else{
      //move item
      //find item with priority+1
      //set its priority to minus one
      //set this priority to plus one
      var correctProjectKey = this.state.projectKey;
      var first = false;
      var second = false;
      var third = false;
      this.productBacklogRef.on("value", (snapshot) => {
      var done = false;
      snapshot.forEach((child) => { //each product backlog item
      var thisPriority='';
      var proj = '';
      var loc = '';
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          var itemList = data.val();
          if(itemName=='key'){
            proj = itemList;
          }
          else if(itemName=='location'){
            loc = itemList;
          }
          else if(itemName=='priority'){
            thisPriority = itemList;
            if(proj==correctProjectKey && loc=='productBacklog'){
              //items are a match.
             
              if(thisPriority==currentPriority){
              console.log("THIS: " + thisPriority);
              console.log("TARGET: " + targetPriority);
              console.log("CURRENT: " + currentPriority);
              if(!first){
                console.log("First updated");
                    first=true;
                    // thisPriority='temp';
                    child.ref.update({
                       priority:'temp',
                    });
              }
              }
              else if(thisPriority==targetPriority){
                console.log("THIS: " + thisPriority);
                console.log("TARGET: " + targetPriority);
                console.log("^^^^^^^^^^^^^^^CURRENT PRIORITY: " + currentPriority);
                if(first && !second){
                   console.log("Second updated");
                    second=true;
                    // thisPriority=(currentPriority);
                    child.ref.update({
                       priority:currentPriority,
                    });
                }
              }
             else if(thisPriority=='temp'){
              console.log("THIS: " + thisPriority);
              console.log("TARGET: " + targetPriority);
              console.log("CURRENT: " + currentPriority);
              if(first && second && !third){
                console.log("Third updated");
                    third=true;
                    // thisPriority=targetPriority;
                    child.ref.update({
                       priority:targetPriority,
                    });
              }
                    
             }    
            }
          }
            });
          });
      });
      }
  }

_renderSprintItem(item) {
    var correctProjectName=this.state.projectName;
    var correctUserName=this.state.username;
    var correctProjectKey = this.state.projectKey;
    var correctRole = this.state.role;

    const onPress = () => {
      var desc = ''
      var correctUserStoryKey = item.userStoryKey;
      if(item.des!=false){
        desc = item.des;
      }
      if(correctRole == 'Dev Team'){
        AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est ,
        null,
        [
         {text: 'Add a Task', onPress: (text) => this.props.navigator.push({
          title: 'Add a Task',
          component: AddTask,
          passProps:{
              username: correctUserName,
              projectName: correctProjectName,
              projectKey: correctProjectKey,
              userStoryKey: correctUserStoryKey,
              role: correctRole,
          }
          })},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else{
        AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est + '\n\n' +
        'You are a product owner so you can not add tasks to the user story.',
        null,
        [
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }

    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }


  _renderToDoTasks(item){
    const onPress = () => {
      var correctTaskKey = item.key;

        AlertIOS.alert(
        'Description: ' + item.desc +  '\n\n User Story: ' + item.us +'\n\n Assigned Member: ' + item.memb + '\n\n Percentage: ' + item.percent,
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

