import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated} from 'react-native';

class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {  
            'up'    : require('../images/up.png'),
            'down'  : require('../images/down.png')
        };

        this.state = {
            title       : props.title,
            expanded    : false,
            animation   : new Animated.Value()
        };
    }

    toggle(){
         let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
        finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

    this.setState({
        expanded : !this.state.expanded 
    });

    this.state.animation.setValue(initialValue); 
    Animated.spring(    
        this.state.animation,
        {
            toValue: finalValue
        }
    ).start(); 
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height 
        });
        this.state.animation.setValue(event.nativeEvent.layout.height);
    }
        render(){
            let icon = this.icons['down'];
            if(this.state.expanded){
                icon = this.icons['up']; 
            }

        return ( 
        <Animated.View 
            style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}> 
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}
export default Panel;

var styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin: 10,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontSize: 18,
        fontFamily: "Helvetica",
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 45,
        height  : 40
    },
    body        : {
        padding     : 20,
        paddingTop  : 0
    }
});