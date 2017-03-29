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
import Home from './Home';
import Register from './Register';
import navigator from './Navigation';
import config from '../../config';

const StatusBar = require('../components/StatusBar');

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };

        //this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.toRegister = this.toRegister.bind(this);

        this.usersRef = this.getRef().child('users');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

  render() {
    return (
        <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Scrum Board Login" />
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
            <Container>
            <Label text="Password" />
            <TextInput
                secureTextEntry={true}
                returnKeyType = 'go'
                autoCapitalize= 'none'
                style={styles.textInput}
                onChangeText={(text) =>{
                    this.setState({password:text});
                }}
            />
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Sign In"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.login.bind(this)} />
                   
                </Container>
                <Container>
                    <Button 
                        label="Register"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.toRegister.bind(this)} />
                </Container>
                <Container>
                    <Button 
                        label="CANCEL"
                        styles={{label: styles.buttonBlackText}} 
                        onPress={this.press.bind(this)} />
                </Container>
            </View>
        </ScrollView> 
    );
  }
  press = () => {
    this.props.navigator.push({
      title: 'Login',
     component: Login
    });
}

//If Register button is clicked the page redirects to teh register page
  toRegister = () =>{
    this.props.navigator.push({
      title: 'New User Registration',
     component: Register
    });
  }

//Verifies if the password and username are correct to login
login(){
    var correctUserName = this.state.username;
    var correctPassword = this.state.password;
    this.usersRef.on("value", (snapshot) => {
        var done = false;
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                if(child.val().password == correctPassword){
                    done = true;   
                    //Alert states if the password is correct
                    // AlertIOS.alert(
                    //     'Logged in!',
                    //     'Login was successful.',
                    //     [
                    //         {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
                    //     ]
                    //     );
                    //redirects to the home page if login is correct
                    this.props.navigator.push({
                         title: 'Home',
                         component: Home
                    });
                    }
                    else{
                    done = true;
                    AlertIOS.alert(
                        'Error!',
                        'Password is incorrect.',
                        [
                            {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
                        ]
                        );
                }
            }
        });
    
    if(done==false){
    AlertIOS.alert(
            'Error!',
            'User does not exist.',
            [
                {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
            ]
            );
    }
    });
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