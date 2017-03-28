/**
 * Sample Firebase & React Native App
 * https://github.com/davideast/firebase-react-native-sample
 */
'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
import Icon from 'react-native-vector-icons/FontAwesome';
//import Container from 'components/Container';
//import Button from '../components/Button';
//import Label from '../components/Label';

const StatusBar = require('../components/StatusBar');

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuh2uRDu_zY7ivQ0VQhZxmYmFeAgh-wpo",
  authDomain: "scrumboard-ab551.firebaseapp.com",
  databaseURL: "https://scrumboard-ab551.firebaseio.com/",
  storageBucket: "scrumboard-ab551.appspot.com",
  messagingSenderId: "72074096172"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class DemoAppFirebase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
    this.buyersRef = this.getRef().child('buyers');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  

  listenForItems() {
    var newBuyersRef = this.buyersRef;
    this.itemsRef.on("child_added", function(snapshot) {
      //snapshot.forEach(function(snapshot){
      // get children as an array
      var items = [];
      var titleName = snapshot.val().title;
      var price = snapshot.val().price;
      if(price>25){
      console.log(snapshot.key + "    " + titleName + "    " + price);
      //this.listenForBuyers();
      newBuyersRef.on("child_added", function(snapshot1) {
        //snapshot1.forEach(function(snapshot1){
        var itemName = snapshot1.val().item;
        //console.log("For each" + itemName);
        if(titleName==itemName){
         console.log(snapshot1.key + "    " + snapshot1.val().FName);
        }
          //console.log(title);
   // });
      });
      }
      });
  //});

  //console.log('break here');
    //this.buyersRef.on("child_added", function(snapshot1) {
         //console.log(snapshot1.key + "    " + snapshot1.val().FName);
          //console.log(title);
   // });
      //snapshot.forEach((child) => {
      //   if(child.val().price>25){
      //     //buyersRef.on("child_added", function(snapshot1) {
      //       //buyersRef.equalTo("KZ").on("child_added", function(snapshot1) {
      //       //console.log(snapshot1.key + "    " + snapshot1.val().FName);
      //       snapshot1.forEach((child1) => {
      //         //if(child1.val().Item==child.val().title){
      //           items.push({
      //           title: child1.val().FName,
      //           //title: child.val().title,
      //         _key: child1.key
      //       });
            
      //       //}
      //     //});
      //   });
      // }
      //});

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

  }

  componentDidMount() {
    this.listenForItems();
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="My To Do List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._removeItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        

      </View>
    )
  }

  _addItem() {
    AlertIOS.prompt(
      'What item would you like to add?',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _removeItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Are you sure you would like to remove?',
        null,
        [
          {text: 'Remove Item', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}

AppRegistry.registerComponent('DemoAppFirebase', () => DemoAppFirebase);
