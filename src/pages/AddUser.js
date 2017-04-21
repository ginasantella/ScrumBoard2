import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AlertIOS,
  NavigatorIOS,
//  Picker,
} from 'react-native';
// const Dropdown = require('react-native-dropdown');
// const {
//   Select,
//   Option,
//   OptionList,
//   updatePosition
// } = DropDown;

// import DropDown, {
//   Select,
//   Option,
//   OptionList,
// } from 'react-native-selectme';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import Home from './Home';
const StatusBar = require('../components/StatusBar');
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

var radio_props = [
  {label: 'Dev Team', value: 0 },
  {label: 'Product Owner', value: 1 }
];

//var Item = Picker.Item;
// import Menu, {
//     MenuContext,
//     MenuOptions,
//     MenuOption,
//     MenuTrigger
// } from 'react-native-menu';


export default class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            value:0,
            role:"",
            passbackUsername: this.props.username,
            projectName: this.props.projectName,
            projectKey: this.props.projectKey,
        };
        this.addUser = this.addUser.bind(this);
        this.cancel = this.cancel.bind(this);

        this.usersRef = this.getRef().child('users');
        this.projectsRef = this.getRef().child('projects');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

    //  _getOptionList() {
    //     return this.refs['OPTIONLIST'];
    // }
    // _setRole(rolename) {
    //     this.setState({
    //     ...this.state,
    //     role: rolename
    //     });
    // }

//     onValueChange(rolename){
//     this.setState({
//         ...this.state,
//         role: rolename
//         });
// }

    render() {
        return (
            <ScrollView style={styles.scroll}>
                <Container>
                    <StatusBar title={"Add User to: " + this.state.projectName} />
                </Container>
                <Container>
                <Label text={"Username"} />
                <TextInput
                    style={styles.textInput} 
                    autoCapitalize= 'none'
                    returnKeyType = "next"
                    autoFocus = {true}
                    onChangeText={(text) =>{
                        this.setState({username:text});
                    }}/>
                </Container>
                <Container>
                    <Label text={"Role"} style={styles.labelText}/>
                    {/*<TextInput
                    style={styles.textInput} 
                    autoCapitalize= 'none'
                    returnKeyType = "next"
                    onChangeText={(text) =>{
                        this.setState({role:text});
                    }}/>*/}
                
                    <View>
                        <RadioForm
                            radio_props={radio_props}
                            initial={0}
                            onPress={(value) => {this.setState({value:value})}}/>
                    </View>
                    </Container>
                    {/*<Picker
                        selectedValue={this.state.role}
                        onValueChange={(name) => {this.setState({role:name});}}>
                        <Item label="Dev Team" value="Dev Team" />
                        <Item label="Product Owner" value="Product Owner" />
                    </Picker>*/}
                    {/*<Label text={"Role"} />
                    <View style={styles.dropdown}>
                    <Select
                        optionListRef={this._getOptionList.bind(this)}
                        defaultValue="Dev Team"
                        onSelect={this._setRole.bind(this)}>
                        <Option>Dev Team</Option>
                        <Option>Product Owner</Option>                        
                        </Select>
                        <OptionList ref="OPTIONLIST"/>
                        </View>*/}
                
                    {/*<MenuContext style={{ flex: 1 }} ref="MenuContext">
                        <View style={styles.content}>
                            <Text style={styles.contentText}>
                                Select desired role:
                            </Text>
                            <Menu style={styles.dropdown} onSelect={(value) => this.setState({ role: value })}>
                            <MenuTrigger value="Dev Team">
                            <Text>Dev Team</Text>
                            </MenuTrigger>
                            <MenuOptions optionsContainerStyle={styles.dropdownOptions}
                            renderOptionsContainer={(options) => <ScrollView><Text>Roles</Text>{options}</ScrollView>}>
                            <MenuOption value="Dev Team">
                            <Text>Dev Team</Text>
                            </MenuOption>
                            <MenuOption value="Product Owner">
                            <Text>Product Owner</Text>
                            </MenuOption>
                            </MenuOptions>
                            </Menu>
                        </View>
                    </MenuContext> */}
                <View style={styles.footer}>
                    <Container>
                        <Button 
                            label="Add New User to a Board"
                            styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                            navigator={this.props.navigator}
                            onPress={this.addUser.bind(this)} />
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
    var passbackUsername=this.state.passbackUsername;
    this.props.navigator.push({
        title: 'Home',
        component: Home,
        passProps:{
            username: passbackUsername,
        }
    });
}

addUser(){
    var correctUserName = this.state.username;
    var correctProjectKey = this.state.projectKey;
    var correctProjectName = this.state.projectName;
    var correctRole = "Dev Team";
    var correctValue = this.state.value;
    if(correctValue==1){
        correctRole="Product Owner";
    }

    var done = false;
    var exists = false;
    var once =false;
    var second=false;

    this.usersRef.on("value", (snapshot) => {
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                    done = true; 
                    this.projectsRef.on("value", (snapshot) => {
                        snapshot.forEach((child) => {
                            var childKey = child.key;
                            if(childKey==correctProjectKey){
                                child.forEach(function(data)  {
                                var itemName = data.key;
                                    if(itemName=='users'){
                                        data.forEach(function(data1){
                                        var userID = data1.key;
                                            if(userID==correctUserName && once!=true){
                                                    exists = true;
                                            }
                                        });
                                        if(!exists && once!=true){
                                            if(itemName=='users' && once!=true){
                                            once=true;
                                                data.ref.update( {
                                                        [correctUserName]: correctRole,            
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });
                    if(!exists && second!=true){
                        child.forEach(function(data)  {
                        var itemName = data.key;
                            if(itemName=='projects'){                 
                                second=true;
                                data.ref.update( {
                                    [correctProjectKey]: correctRole,
                                });
                            }
                        });
                        if(!second) {
                            second = true;
                            child.ref.update( {
                                projects: {[correctProjectKey]: correctRole}
                                
                            });
                        }
                }
            }
        });
    });
        if (exists && !second) {
            var passbackUsername=this.state.passbackUsername;
            var projectname = this.state.projectName;
            var projectKey = this.state.projectKey;
            AlertIOS.alert(
                'Error!',
                'This user is already a part of this project',
                    [
                        {text: 'Okay', onPress: (text) => this.props.navigator.push({
                        title: 'Add User',
                        component: AddUser,
                        passProps:{
                            username: passbackUsername,
                            projectName: projectname,
                            projectKey: projectKey,
                            }
                        })},
                    ]
            );
        }
    
    if(done==false){
        var passbackUsername=this.state.passbackUsername;
        var projectname = this.state.projectName;
        var projectKey = this.state.projectKey;
        AlertIOS.alert(
            'Error!',
            'This user does not exist! Please add an existing user.',
                [
                {text: 'Okay', onPress: (text) => this.props.navigator.push({
                title: 'Add User',
                component: AddUser,
                    passProps:{
                        username: passbackUsername,
                        projectName: projectname,
                        projectKey: projectKey,
                    }
                })},
                ]
        );
    }
    else if(done && !exists){
        var passbackUsername=this.state.passbackUsername;
        var username = this.state.username;
        var projectname = this.state.projectName;
        once=true;
        AlertIOS.alert(
            'Success!',
            'User was added to the project.',
                [
                {text: 'Okay', onPress: (text) => this.props.navigator.push({
                                    title: 'Home',
                                    component: Home,
                                    passProps:{
                                        username: passbackUsername,
                                    }
                    }), style: 'cancel'},
                ]
        );
    }
}
//End of class
}

//Styles
const styles = StyleSheet.create({
 scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
picker: {
    flex:1,
  },
content: {
   backgroundColor: '#E1D7D8',
   padding: 50,
   flexDirection: 'column'                                 
},
contentText: {
   fontSize: 18
},
labelText: {
   fontSize: 12
},
dropdown: {
   height: 40,
   backgroundColor: '#FFF',
   flex:1,
   },
dropdownOptions: {
  marginTop: 30,
  borderColor: '#ccc',
  borderWidth: 2,
  width: 300,
  height: 200
},
label: {
    color: '#0d8898',
    fontSize: 15
},
alignRight: {
    alignSelf: 'flex-end'
},
textInput: {
    height: 40,
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
