import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';

const StatusBar = require('../components/StatusBar');



export default class Register extends Component {
  render() {
    return (
        <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Registration" />
            </Container>
            <Container>
            <Label text="First Name" />
            <TextInput
                style={styles.textInput} />
            </Container>
	     <Container>
            <Label text="Last Name" />
            <TextInput
                style={styles.textInput} />
            </Container>
            <Container>
            <Label text="Username" />
            <TextInput
                secureTextEntry={true}
                style={styles.textInput}
            />
            </Container>
	     <Container>
	     <Label text="Password" />
            <TextInput
                secureTextEntry={true}
                style={styles.textInput}
            />
            </Container>
	 <Container>
	     <Label text="Confirm Password" />
            <TextInput
                secureTextEntry={true}
                style={styles.textInput}
            />
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Register"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        onPress={this.press.bind(this)} />
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
  press() {
  //execute any code here
}
}

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
