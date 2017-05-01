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
import Home from './Home';
import ListItem from '../components/ListItem';
import ScrumBoard from './ScrumBoard';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const StatusBar = require('../components/StatusBar');

var radio_props = [

  {label: 'Dev Team', value: 0 },
  {label: 'Product Owner', value: 1 }
];

const mockData = [
    {
        label: 'label1',
        value: 'fi'
    },
    {
        label: 'label2',
        value: 'se'
    },
    {
        label: 'label3',
        value: 'th'
    }
];
     var users = []; 

 export default class AddTask extends Component {

        constructor(props) {
            super(props);

            this.state = {
                username: this.props.username,
                projectKey: this.props.projectKey,
                projectName: this.props.projectName,
                tDescription: "",
                tMemberAssigned: "",
                tPercentage: "",
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                }),
                getInitialState() {
                    return {
                        userArray: ['a', 'b', 'c', 'd', 'e'],
                    }
                }
            };
             
            this.pblRef = this.getRef().child('prodBacklogs');
            this.projectsRef = this.getRef().child('projects');
        }

        getRef() {
            return firebaseApp.database().ref();
        }
        


    componentDidMount() {
         this.setState({
          userArray: this.userList()
         }) 

   }

   userList(){
       var correctProjKey = this.state.projectKey;
       user = [];
       this.projectsRef.on("value", (snapshot) => {
           snapshot.forEach((child) => { //each project
               if(child.key == correctProjKey){
               child.forEach(function(data)  { //each attribute
                   var itemName = data.key;
                   if(itemName=='users'){
                        data.forEach(function(data2) {
                            var username = data2.key;
                            data2.forEach(function(data3) {
                                var role = '';
                                var pendingStatus = '';
                                if(data3.key == "_role"){
                                    role = data3.val();
                                }
                                if(data3.key == 'pending'){
                                    pendingStatus = data3.val();
                                }
                                if(pendingStatus == false){
                                    if(role == 'Dev Team'){
                                 console.log("####PENDING STATUS: " + pendingStatus);
                                    console.log("**************USERNAME: " + username);
                                    users.push({
                                        label: username,
                                        value: username,
                                    });
                                    }
   
                                } 
                            });

                        });
                    }
               });
               }

           });
       });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(users)
        });
   }

    render() {
        return (
            <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Task Item" />
            </Container>
	     <Container>
             <Label text="Description" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                onChangeText={(text) =>{
                    this.setState({tDescription:text});
                }}/>
            </Container>
            <Container>
             <Label text="Percentage of User Story" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                onChangeText={(text) =>{
                    this.setState({tPercentage:text});
                }}/>
            </Container>
            <Container>
             <Label text="Member Assigned to Task" />
                <RadioForm
                    radio_props={users}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}/>
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Create Task"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        onPress={this.toCreateTask.bind(this)} />
                </Container>
                <Container>
                    <Button 
                        label="CANCEL"
                        styles={{label: styles.buttonBlackText}} 
                        onPress={this.cancel.bind(this)} />
                </Container>
            </View>
        </ScrollView> 
        );
    }
    cancel = () => {
              var correctProjectName = this.state.projectName;
      var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
        this.props.navigator.push({
            title: 'Scrum Board',
            component: ScrumBoard, 
            passProps:{
              username: correctUserName,
              projectKey: correctProjKey,
              projectName: correctProjectName,
            }
        });
    }


_renderItem(item) {
      //var correctUserName = this.state.username;
      //var correctProjectName = item.title;
      //var correctProjectKey = item.projectKey;
    
    const onPress = () => {
        var desc = item.user;
      AlertIOS.alert(
        'Description: ' + desc + '\n\n ',
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


    toCreateTask(){
        var correctDescription = this.state.tDescription;
        var correctMemberAssigned = this.state.tMemberAssigned;
        var correctPercentage = this.state.tPercentage;
        var correctProjectName = this.state.projectName;

        var done=false;
        var once = false;
     
        if(once != true){
        this.pblRef.on("value", (snapshot) => {
            snapshot.forEach((child) => { //for each pbl item
                if(child.val() == correctProjectName){
                    child.forEach(function(data){ //for each attribute
                        var itemName = data.key;
                        if(itemName == 'tasks'){
                            this.pblRef.push({
                                _description: correctDescription, 
                                percentage: correctPercentage,
                                assignedMember: correctMemberAssigned})
                        }
                        else{
                            this.pblRef.push({
                                tasks: {
                                    _description: correctDescription, 
                                    percentage: correctPercentage,
                                    assignedMember: correctMemberAssigned}
                            });
                        }
                    });
                }
        });
          
        if(done == false && once!=true){
            var currentStatus = "productBacklog";
                    var correctProjectName = this.state.projectName;
            var correctUserName = this.state.username;
            var correctProjKey = this.state.projectKey;
            once=true;
            var second=false;
            
        var size = 0;
                this.projectsRef.on("value", (snapshot) => {
                    snapshot.forEach((child) => {
                    if(child.key==correctProjKey ){
                    size=size+1;
                    
                    }});

                });
                    this.pblRef.push( {acc : tMemberAssigned ,
                            _userStory: tDescription,
                                description: pbiDescript,
                                estimate: tPercentage,
                            project: correctProjKey,
                            location: currentStatus,
                            priority: size,
                    })
                    AlertIOS.alert(
                                'Success!',
                                'Click View to Updated Scrum Board',
                                [
                                    {text: 'Okay', onPress: () => this.props.navigator.push({
                                            title: 'Scrum Board',
                                            component: ScrumBoard,
                                        passProps:{
                    username: correctUserName,
                    projectKey: correctProjKey,
                    projectName: correctProjectName,
                    },                 
                        }), style: 'cancel'},
                                ]
                                );                   
                    }

                    });
                }   

    }
//end of class
}

//Styles
const styles = StyleSheet.create({
 scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
label: {
    color: '#0d8898',
    fontSize: 15
},
alignRight: {
    alignSelf: 'flex-end'
},
textInput:{
    height: 30,
    fontSize: 15,
    backgroundColor: '#FFF'
},
textInput2: {
    height: 80,
    fontSize: 15,
    backgroundColor: '#FFF'
},
buttonWhiteText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "500",
    textAlign: 'center',
    fontFamily: "Helvetica"
},
buttonBlackText: {
    fontSize: 20,
    color: '#595856'
},
primaryButton: {
    backgroundColor: '#4169E1',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
},
footer: {
   marginTop: 40
}

});