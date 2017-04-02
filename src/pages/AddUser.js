import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AlertIOS,
  NavigatorIOS,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import Home from './Home';
const StatusBar = require('../components/StatusBar');


export default class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ""
        };
        this.addUser = this.addUser.bind(this);

        this.usersRef = this.getRef().child('users');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

  render() {
    return (
        <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Add a User" />
            </Container>
            <Container>
            <Label text="Username" />
            <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({username:text});
                }}/>
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Add New User to a Board"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.addUser.bind(this)} />
                </Container>
            </View>
        </ScrollView> 
    );
  }
//   addUser = () => {
//     this.props.navigator.push({
//         title: 'Home',
//         component: Home
//     });
// }

//Verifies if the password and username are correct to login
addUser(){
    var correctUserName = this.state.username;
    this.usersRef.on("value", (snapshot) => {
        var done = false;
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                    done = true; 
                    //Alert states if the password is correct
                    // AlertIOS.alert(
                    //     'User Additon!',
                    //     'The user exhists and can be added.',
                    //     [
                    //         {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
                    //     ]
                    // );
                    //redirects to the home page if user exhists is correct
                    this.props.navigator.pop();
            }
        });
        if(done==false){
            AlertIOS.alert(
                'Error!',
                'This user does not exhist! Please add an exhisting user.',
                 [
                {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
            ]
            );
        }
    });
}
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