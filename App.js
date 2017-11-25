import React, { Component } from 'react';
import {AppRegistry,
        Text, 
        View, 
        StyleSheet,
        ListView,
        TouchableHighlight,
        Modal,
        TextInput 
} from 'react-native';
const styles = require('./app/style');    
import Toolbar from './app/components/Toolbar/Toolbar';
import * as firebase from 'firebase';
import AddButton from './app/components/AddButton/AddButton';

const firebaseConfig = {
	 apiKey: "AIzaSyDTDh-ovf57KggUaZkcRfkr_pFsoLSo4Cg",
    authDomain: "items-5ed65.firebaseapp.com",
    databaseURL: "https://items-5ed65.firebaseio.com",
    storageBucket: "items-5ed65.appspot.com"
}

//const firebaseApp = firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}


export default class ItemLister extends Component {
  constructor(){
  	super();
  	let ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
  	this.state = {
  		text: '',
  		itemDataSource: ds,
  		modalVisibble: false
  	}
  	
  	this.itemsRef = this.getRef().child('items');
  	
  	this.renderRow = this.renderRow.bind(this);
  	this.pressRow = this.pressRow.bind(this);
  }
  
  setModalVisible(visible){
  	this.setState({modalVisible:visible});
  }
  
  getRef(){
  	return firebaseApp.database().ref();
  }
  
  componentWillMount(){
  	this.getItems(this.itemsRef);
  }
  
  componentDidMount(){
  	this.getItems(this.itemsRef);
  }
  
  getItems(itemsRef){
  	//let items = [{title:'Item One'},{title:'Item Two'}];
  	itemsRef.on('value',(snap) => {
  		let items = [];
  		snap.forEach((child) => {
  			items.push({
  			  title: child.val().title,
  			  _key: child.key
  			});
  		});
  		
  		this.setState({
  		itemDataSource: this.state.itemDataSource.cloneWithRows(items)
  		});
  		
  	});
  }
  
  pressRow(item){
  	 this.itemsRef.child(item._key).remove();
  }
  
  renderRow(item){
  	return (
  	  <TouchableHighlight onPress={() => {
  	    this.pressRow(item);
  	  }}>
	  	  <View style={styles.li}>
	  	    <Text style={styles.liText}>{item.title}</Text>
	  	  </View>
  	  
  	  </TouchableHighlight>
  	);
  }
  
  addItem(){
  	this.setModalVisible(true);
  }
  
  render() {
    return (
      <View style={styles.container}>
      <Modal 
      	animationType="slide"
      	transparent={false} 
      	visible={this.state.modalVisible} 
      	onRequestClose={() => {}} 
      	> 
       <View style={{marginTop: 22}}> 
        <View> 
          <Toolbar title="Add Item" />
          <TextInput
          	placeHolder="Add Item"
          	onChangeText = {(value) => this.setState({text:value})}
          />
          <TouchableHighlight onPress={() => { 
          	this.itemsRef.push({title: this.state.text});
          	this.setModalVisible(!this.state.modalVisible) 
          }}> 
            <Text>Save Item</Text>
          </TouchableHighlight> 
          
          <TouchableHighlight onPress={() => { 
          	this.setModalVisible(!this.state.modalVisible) 
          }}>
            <Text>Cancel</Text>
          </TouchableHighlight> 
          
         </View>
        </View> 
       </Modal>
       
        <Toolbar title="ItemLister" />
        <ListView
          dataSource={this.state.itemDataSource}
          renderRow={this.renderRow}
        />
        
        <AddButton onPress={this.addItem.bind(this)} title="Add Item" />
      </View>
    );
  }
}

AppRegistry.registerComponent('ItemLister', () => ItemLister);