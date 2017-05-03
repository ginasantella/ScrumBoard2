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
import Home from './Home';
import navigator from './Navigation';
import config from '../../config';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import AddPBL from './AddPBL';
import EditPBL from './EditPBL'
import ListItem from '../components/ListItem';
import AddTask from './AddTask';
const StatusBar = require('../components/StatusBar');
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
              inProgressTasks:[],
              toDoTasks:[],
              doneTasks: [],
              dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              sprintDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              toDoDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              inProgressDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              doneTasksDataSource: new ListView.DataSource({
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
    this.productBacklogRef.on("value", (snapshot) => {
      var thisProductBacklog =[];
      var thisSprintBacklog =[];
      var thisToDoTasks = [];
      var thisInProgressTasks = [];
      var thisDoneTasks = [];
      snapshot.forEach((child) => { //each product backlog item
      var childVal = child;
      var AC = '';
      var desc = '';
      var estimate = '';
      var userStory = '';
      var status = '';
      var projectValue ='';
      var priority = '';
      var userStoryKeyValue = child.key;
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          var itemList = data.val();
          
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

          }
          else if(itemName == 'priority'){
            priority = itemList;
          }
          else if(itemName=='location'){
            status = itemList;

          }
          else if(itemName=='project'){
            projectValue = itemList;
            var totalPercentage = 0;
                if(projectValue==correctProjectKey){
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
                          val: userStoryKeyValue,
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
                            val: userStoryKeyValue,
                            
                        });
                    }
                }
                else if(status=='sprintBacklog'){
                  var projectVal = '';
                  child.forEach(function(data1)  {
                    var itemName2 = data1.key;
                    var itemList2 = data1.val(); 
                    if(itemName2=='project'){
                        projectVal = itemList2;
                    }
                    else if(itemName2 =='tasks'){
                      if(projectVal==correctProjectKey){
                      var taskStatus = '';
                      var percentage = '';
                      data1.forEach(function(data2)  {
                        var taskKey = data2.key;
                        data2.forEach(function(data3){
                          var taskName = data3.key;
                          var taskValue = data3.val();
                          if(taskName == "percentage"){
                            percentage = taskValue;
                          }
                          else if(taskName == 'status'){
                            taskStatus = taskValue;
                            if(taskStatus =='Done'){
                                totalPercentage = totalPercentage + parseInt(percentage, 10);
                            }
                          }
                        });
                      });
                    }
                  }
                  });
                  if(userStory == ""){
                    var newDesc = priority + ". " + desc + "\t " + totalPercentage + "%";
                    thisSprintBacklog.push({
                            title: newDesc,
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
                    var newUserStory = priority + ". " + userStory + "\t " + totalPercentage + "%";
                    thisSprintBacklog.push({
                            title: newUserStory,
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
              var taskKey = data2.key;
              data2.forEach(function(data3){
                var taskName = data3.key;
                var taskValue = data3.val();
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
                      var newDesc = priority + ". " + description;
                      thisToDoTasks.push({
                        title: newDesc,
                        key: taskKey,
                        percent: percentage,
                        desc: description,
                        memb: assignedMember,
                        stat: taskStatus,
                        us: userStory,
                        userStoryKey: projectValue,
                    });
                  }
                  else if(taskStatus =='InProgress'){
                      var newDesc = priority + ". " + description;
                      thisInProgressTasks.push({
                        title: newDesc,
                        key: taskKey,
                        percent: percentage,
                        desc: description,
                        memb: assignedMember,
                        stat: taskStatus,
                        us: userStory,
                        userStoryKey: projectValue,
                    });
                  }
                  else if(taskStatus =='Done'){
                      var newDesc = priority + ". " + description;
                      thisDoneTasks.push({
                        title: newDesc,
                        key: taskKey,
                        percent: percentage,
                        desc: description,
                        memb: assignedMember,
                        stat: taskStatus,
                        us: userStory,
                        userStoryKey: projectValue,
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
          inProgressDataSource: this.state.inProgressDataSource.cloneWithRows(thisInProgressTasks),
          doneTasksDataSource: this.state.doneTasksDataSource.cloneWithRows(thisDoneTasks),
          productBacklog: thisProductBacklog,
          sprintBacklog: thisSprintBacklog,
          toDoTasks: thisToDoTasks,
          inProgressTasks: thisInProgressTasks,
          doneTasks: thisDoneTasks,
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
                                              
                                              }
                                              
                                            });
                                             
                                                     exists = true;
                                             }
                                        });
                                         if(!exists && once!=true){
                                            if(itemName=='users' && once!=true){
                                            once=true;
                                            correctRole=[correctUserName]._role;
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

  toEditPL = (item) =>{
    var correctpblKey=item.val;
    var correctProjectName=this.state.projectName;
    var correctUserName=this.state.username;
    var correctRole = this.state.role;
    var done = false;
    var exists = false;
    var once =false;
    var second=false;

    var correctEstimate=item.est;
    var correctDesc = item.des;
    var correctLocation = item.stat;
    var correctUserStory = item.us;
    var correctAc = item.ac;
    var correctEstimateVal;
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
          pblKey: correctpblKey,
         
      }
    });

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
          <View style={{ flex: 1 }}>
          <ListView
            dataSource={this.state.inProgressDataSource}
            enableEmptySections={true}
            renderRow={this._renderInProgressTasks.bind(this)}
            style={styles.listview}/>
          </View>
        </Container>
        <Container>
       <Label text={"Done"} />
          <View style={{ flex: 1 }}>
          <ListView
            dataSource={this.state.doneTasksDataSource}
            enableEmptySections={true}
            renderRow={this._renderDoneTasks.bind(this)}
            style={styles.listview}/>
          </View>
        </Container>
        </ScrollView>

    );
  }
_renderItem(item) {
      //var correctUserName = this.state.username;
      //var correctProjectName = item.title;
      //var correctProjectKey = item.projectKey;
      var correctRole=this.state.role;
     
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

      if(correctRole=="Product Owner"){
      AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est ,
        null,
        [
          {text: 'Move Item Up', onPress: (text) => this.moveUp(item)},
          {text: 'Move Item Down', onPress: (text) => this.moveDown(item)},       
          {text: 'Edit Product Backlog', onPress: (text) =>this.toEditPL(item)},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    
    else{

      AlertIOS.alert(
        'Description: ' + desc + '\n\n AC: ' + item.ac + '\n\n Size: ' + item.est ,
        "Dev Team members can not edit a product backlog item.",
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
          title: 'Add a Task',
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
    var correctRole = this.state.role;
    const onPress = () => {
    var correctTaskKey = item.key;

      if(correctRole == 'Dev Team'){
        AlertIOS.alert(
        'Description: ' + item.desc +  '\n\n User Story: ' + item.us +'\n\n Assigned Member: ' + item.memb + '\n\n Percentage: ' + item.percent,
        null,
        [
          {text: 'Move Task to In Progress', onPress: (text) => this.moveToInProgress(item)},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
      else{
        AlertIOS.alert(
        'Description: ' + item.desc +  '\n\n User Story: ' + item.us +'\n\n Assigned Member: ' + item.memb + '\n\n Percentage: ' + item.percent + '\n\n' +
        'You cannot move this task becuase you are a Product Owner.',
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

  moveToInProgress(item){
    var correctStatus = item.stat;
    var correctPrecentage = item.percent;
    var correctDescription = item.desc;
    var correctMember = item.memb;
    var correctTaskKey = item.key;
    var correctUserStoryKey = item.userStoryKey;
    var popup = false;

    if(correctPrecentage == '' && correctMember == ''){
      popup = true;
        AlertIOS.alert(
        'Please edit the task and enter a percentage and assign a member before continuing.',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else if(correctPrecentage == '' && popup != true){
      popup = true;
        AlertIOS.alert(
        'Please edit the task and enter a percentage before continuing.',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else if(correctMember == '' && popup != true){
      popup = true;
        AlertIOS.alert(
        'Please assign a member to the task before continuing.',
        null,
        [
          {text: 'Okay', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
    else if(popup != true){
      this.productBacklogRef.on("value", (snapshot) => {
      snapshot.forEach((child) => { //each product backlog item
      child.forEach(function(data)  { //each attribute
          var itemName = data.key;
          var itemList = data.val();
          var projectVal = '';
          if(itemName=='project'){
            projectValue = itemList;
          }
          else if(itemName =='tasks'){
            if(projectValue==correctUserStoryKey){
            var taskStatus = '';
            data.forEach(function(data2)  {
              var taskKey = data2.key;
              data2.forEach(function(data3){
                var taskName = data3.key;
                var taskValue = data3.val();
                if(taskName == 'status'){
                  taskStatus = taskValue;
                  if(taskStatus =='ToDo'){
                    if(taskKey == correctTaskKey){
                        data2.ref.update({
                          status:'InProgress',
                        });
                    }
                  }
                }
              });
            });
          }
          }
        });    
      });
    });

    }

  }

  _renderInProgressTasks(item){
    var correctRole = this.state.role;
    const onPress = () => {
    var correctTaskKey = item.key;

      if(correctRole == 'Dev Team'){
        AlertIOS.alert(
        'Description: ' + item.desc +  '\n\n User Story: ' + item.us +'\n\n Assigned Member: ' + item.memb + '\n\n Percentage: ' + item.percent,
        null,
        [
          {text: 'Move Task to Done', onPress: (text) => this.moveToDone(item)},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    }
      else{
        AlertIOS.alert(
        'Description: ' + item.desc +  '\n\n User Story: ' + item.us +'\n\n Assigned Member: ' + item.memb + '\n\n Percentage: ' + item.percent + '\n\n' +
        'You cannot move this task becuase you are a Product Owner.',
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

  moveToDone(item){
    var correctTaskKey = item.key;
    var correctUserStoryKey = item.userStoryKey;

    this.productBacklogRef.on("value", (snapshot) => {
    snapshot.forEach((child) => { //each product backlog item
    child.forEach(function(data)  { //each attribute
        var itemName = data.key;
        var itemList = data.val();
        var projectVal = '';
        if(itemName=='project'){
          projectValue = itemList;
        }
        else if(itemName =='tasks'){
          if(projectValue==correctUserStoryKey){
          var taskStatus = '';
          data.forEach(function(data2)  {
            var taskKey = data2.key;
            data2.forEach(function(data3){
              var taskName = data3.key;
              var taskValue = data3.val();
              if(taskName == 'status'){
                taskStatus = taskValue;
                if(taskStatus =='InProgress'){
                  if(taskKey == correctTaskKey){
                      data2.ref.update({
                        status:'Done',
                      });
                  }
                }
              }
            });
          });
        }
        }
      });    
    });
  });

  }

  _renderDoneTasks(item){
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
  //END OF CLASS
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