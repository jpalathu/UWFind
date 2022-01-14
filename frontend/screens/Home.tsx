import * as React from "react";
import { Text, View, StyleSheet,TouchableOpacity, ScrollView, Image } from "react-native";
import Colors from "../constants/Colors";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Button
          noDefaultStyles={true}
                    styles={{button: styles.header_button}} 
                    onPress={this.press.bind(this)}
        >
          <View style={styles.back_button}>
            <Icon name="chevron-left" size={20} color="#397CA9" />
                      <Text style={[styles.back_button_label]}> Sections</Text>
          </View>
        </Button> */}
        
                <View style={styles.header_text}>
          <Text style={styles.header_text_label}>Lost Items</Text>
                </View>
                <View style={styles.whitespace}></View>
      </View>

      <View style={styles.instruction}>
        <Text style={styles.instruction_text}>SWIPE ACROSS SECTIONS</Text>
      </View>
      
      <ScrollView style={styles.news_container}>
      <View style={styles.news_item}>
				<View style={styles.news_text}>
					{/* <View style={styles.number}>
						<Text style={styles.title}>{number}.</Text>
					</View> */}
					<View style={styles.text_container}>
          <Text style={styles.title}>'Gray Matter'</Text>
						<Text style={styles.title}>'Art Makes You Smart'</Text>
						<Text>'Museum visits increase test scores, generate social responsibility and increase appreciation of the arts by students.'</Text>
					</View>
				</View>
				<View style={styles.news_photo}>
					{/* <Image source={news.image} style={styles.photo} /> */}
				</View>
			</View>
      <View style={styles.news_item}>
				<View style={styles.news_text}>
					{/* <View style={styles.number}>
						<Text style={styles.title}>{number}.</Text>
					</View> */}
					<View style={styles.text_container}>
          <Text style={styles.title}>'Testing'</Text>
						<Text style={styles.title}>'Fuck'</Text>
						<Text>'Museum visits increase test scores, generate social responsibility and increase appreciation of the arts by students.'</Text>
					</View>
				</View>
				<View style={styles.news_photo}>
					{/* <Image source={news.image} style={styles.photo} /> */}
				</View>
			</View>
      <View style={styles.news_item}>
				<View style={styles.news_text}>
					{/* <View style={styles.number}>
						<Text style={styles.title}>{number}.</Text>
					</View> */}
					<View style={styles.text_container}>
          <Text style={styles.title}>'Fuck you'</Text>
						<Text style={styles.title}>'Bitch'</Text>
						<Text>'Museum visits increase test scores, generate social responsibility and increase appreciation of the arts by students.'</Text>
					</View>
				</View>
				<View style={styles.news_photo}>
					{/* <Image source={news.image} style={styles.photo} /> */}
				</View>
			</View>
      <View style={styles.news_item}>
				<View style={styles.news_text}>
					{/* <View style={styles.number}>
						<Text style={styles.title}>{number}.</Text>
					</View> */}
					<View style={styles.text_container}>
          <Text style={styles.title}>'JK'</Text>
						<Text style={styles.title}>'swag'</Text>
						<Text>'Museum visits increase test scores, generate social responsibility and increase appreciation of the arts by students.'</Text>
					</View>
				</View>
				<View style={styles.news_photo}>
					 <Image source={require('../photos/selina.png')} style={styles.photo} /> 
				</View>
			</View>
      </ScrollView>
          
    </View>
  );
  // return (
  //   <View style={styles.container}>
  //     <View>
  //       {/* <TouchableOpacity style={styles.buttonContainer}>
  //         <Text>Change Password</Text>  
  //       </TouchableOpacity>        */}
  //       <Text>
  //         Fill in stuff here or create a new component and add it here
  //       </Text>
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		padding: 20,
		justifyContent: 'space-between',
		borderBottomColor: '#E1E1E1',
		borderBottomWidth: 1
	},
	header_button: {
		flex: 1,
	},
	whitespace: {
		flex: 1
	},
	back_button: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	back_button_label: {
		color: '#397CA9',
		fontSize: 20,
	},
	instruction: {
		alignSelf: 'center',
		marginTop: 5
	},
	instruction_text: {
		color: '#A3A3A3'
	},
	header_text: {
		flex: 1,
		alignSelf: 'center'
	},
	header_text_label: {
		fontSize: 20,
		textAlign: 'center'
	},
	news_container: {
		flex: 1,
		flexDirection: 'column'
	},
  news_item: {
		flex: 1,
		flexDirection: 'row',
		paddingRight: 20,
		paddingLeft: 20,
		paddingTop: 30,
		paddingBottom: 30,
		borderBottomWidth: 1,
		borderBottomColor: '#E4E4E4'
	},
	news_text: {
		flex: 2,
		flexDirection: 'row',
		padding: 10
	},
	number: {
		flex: 0.5,
	},
	text_container: {
		flex: 3
	},
	pretext: {
		color: '#FFFFFF',
		fontSize: 20
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#FFFFFF'
		// fontFamily: 'georgia'
	},
	news_photo: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	photo: {
		width: 120,
		height: 120
	}
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: Colors.gold,
  // },
  // buttonContainer: {
  //   marginTop:10,
  //   height:45,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom:20,
  //   width:250,
  //   borderRadius:30,
  //   backgroundColor: Colors.gold,
  // },
});
