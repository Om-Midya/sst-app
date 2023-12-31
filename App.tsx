/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Appearance,
  useWindowDimensions,
  Pressable,
  PermissionsAndroid,
  StatusBar
} from "react-native";
import SignInScreen from "./src/screens/SignInScreen";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import LinearGradient from "react-native-linear-gradient";
import Logo from "./assets/images/scaler_logo.svg";
import SignInWithGoogle from "./src/components/SignInWithGoogle/SignInWithGoogle";
import SignInWithMicrosoft from "./src/components/SignInWithMicrosoft";
import HavingTrouble from "./src/components/HavingTrouble";
import GoogleLogo from "./assets/images/google_logo.svg";
import MicrosoftLogo from "./assets/images/microsoft_logo.svg";
import DeviceInfo from "react-native-device-info";
import GetLocation from 'react-native-get-location';
import * as domain from "domain";

export default function App(): JSX.Element {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('Anonymous');
  const [did, setdid] = useState("");
  const [userLat, setUserLat] = useState(0);
  const [userLong, setUserLong] = useState(0);
  const [userCord, setUserCord] = useState([]);
  const [userName, setUserName] = useState("");
  const domain_URL = 'http://10.104.124.95:8000/';



  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const {height} = useWindowDimensions();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      if(userLoggedIn) {
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

   function markAttendance() {
    const UserToBeMarked = {
      uid: did
    };

    console.log('Marking Attendance for :  ', UserToBeMarked);

     GetLocation.getCurrentPosition({
       enableHighAccuracy: true,
       timeout: 30000,
       rationale: {
         title: 'Location permission',
         message: 'The app needs the permission to request your location.',
         buttonPositive: 'Ok',
       },
     })
       .then(newLocation => {
         // setUserLat(newLocation.latitude);
         // setUserLong(newLocation.longitude);
         setUserCord([...userCord, newLocation.latitude+","+newLocation.longitude+"\n"]);
         console.log(newLocation.latitude + " " +newLocation.longitude);

         const userData = {
           uid: did,
           latitutde: newLocation.latitude,
           longitude: newLocation.longitude,
         }

         fetch(domain_URL + '/attendance/geo/', {
           method: 'POST',
           body: JSON.stringify(userData),
         })
           .then(response => {
             // Handle the response
             if (response.status == 200) {

             } else {
               throw new Error('Network response was not ok.');
             }
           })
           .then(data => {
             // User allowed login
             if(statCode == 200) {

             } else {

             }
           })
           .catch(error => {

           });




       })
       .catch(ex => {
         console.log(ex);
       });



  }


  const MarkFinalAttendance = () => {

     const StudentToBeMarked = {

     };

  }

  const getClasses = () => {

     let classes = [
       {classID: 1234, className: 'Data Structures and Algorithms', classInstructor: 'Kshitij Mishra', classStartTime: '09:00', classEndTime: '12:00'}
     ];
     // let classes= [];
     if (classes.length === 0) {
       return (
         <View style={LoginStyles.classcontainer}>
           <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
             <Text style={{fontSize: 16, color: "rgba(217,217,217,0.8)"}}>
               No class has been added
             </Text>
           </View>
         </View>
       );
     } else {
       return (
         <View style={LoginStyles.classcontainer}>

           <Text style={{fontSize: 18, marginTop: '6%', marginLeft: '5%', color: '#ffffff'}}>
             {classes[0].className}
           </Text>

           <Text style={{fontSize: 16, marginTop: '3%', marginLeft: '5%', color: '#d7d7d7'}}>
             by {classes[0].classInstructor}
           </Text>

           <Text style={{fontSize: 12, marginTop: '4%', marginLeft: '5%', color: '#e1e1e1'}}>
             {classes[0].classStartTime} - {classes[0].classEndTime}
           </Text>

           <View style={{width: '100%', alignItems: 'center'}}>
             <Pressable style={LoginStyles.markButton} onPress={MarkFinalAttendance}>
               <Text style={{fontSize: 15}}>
                 Mark Attendance
               </Text>
             </Pressable>
           </View>

         </View>
       );
     }
  };



  if (userLoggedIn) {

    return (
    <View>
      <StatusBar animated={true} backgroundColor="#1a1a1a" />

      <LinearGradient colors={['#5B5ABE', '#6D73FB', '#85A0FF']} style={{height: '100%'}} >

        <StatusBar animated={true} backgroundColor={"#5B5ABE"} />

         <View style={{width: '100%', height: 'max-content'}}>

           <Text style={LoginStyles.welcomemessage}>
             Good Morning
           </Text>

           <Text style={LoginStyles.username}>
             {userName}
           </Text>

         </View>

        <View style={{width: '100%', height:'25%', alignItems: 'center'}}>
          {getClasses()}
        </View>
      </LinearGradient>
    </View>
    );
  } else {

    DeviceInfo.getUniqueId().then((uniqueId) => {
      setdid(uniqueId);
    });


    async function LoginWithGoogleNow() {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const userEmail = userInfo.user.email;
        const domain_name_provider = userEmail?.split('@')[1];
        if(domain_name_provider == "sst.scaler.com") {
          const UserToLogin = {
            email: userEmail,
            uid: did,
          };

          let statCode = 400;
          fetch(domain_URL + '/attendance/register/', {
            method: 'POST',
            body: JSON.stringify(UserToLogin),
          })
            .then(response => {
              // Handle the response
              if (response.status == 200) {
                statCode = 200;
              } else {
                throw new Error('Network response was not ok.');
              }
            })
            .then(data => {
              // User allowed login
              statCode = 200;

              if(statCode == 200) {
                setUserLoggedIn(true);
                setUserEmail(userEmail);
                const username = userInfo.user.name?.split(' ');
                // @ts-ignore
                username.concat(' ');
                setUserName(username[0] + ' ' + username[1]);
              } else {
                console.log("Some error at backend");
                signOut();
              }
            })
            .catch(error => {
              statCode = 400;
            });
        }
        else {
          console.log('User Not authorised to signin');
          signOut();
        }


      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('SIGN IN CANCELLED');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('SIGNING IN');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('PLAY SERVICES NOT AVAILABLE');
        } else {
          console.log(error);
        }
      }
    }

    // @ts-ignore
    return (
      <View>

        <StatusBar animated={true} backgroundColor="#5B5ABE" />

        <LinearGradient colors={['#5B5ABE', '#6D73FB', '#85A0FF']} style={{height: '100%'}} >



          <View style={styles.root}>
            <Logo size={height * 0.4} style={styles.logo} />
          </View>

          <View style={[styles.atBottom]}>

            {/*<Text>*/}
            {/*  {did}*/}
            {/*</Text>*/}

            <Pressable style={googlestyles.container} onPress={LoginWithGoogleNow}>
              <GoogleLogo
              />

              <Text style={googlestyles.data}>
                Login with Google
              </Text>
            </Pressable>

            <Pressable style={msstyles.container}>
              <MicrosoftLogo
              />

              <Text style={msstyles.data}>
                Login with Microsoft
              </Text>
            </Pressable>

            <HavingTrouble />

          </View>

        </LinearGradient>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    maxWidth: 300,
    maxHeight: 100,
    marginVertical: '25%',
  },
  atBottom: {
    padding: 15,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: '3%',
  }
});

const LoginStyles= StyleSheet.create({
  welcomemessage: {
    fontSize: 18,
    marginHorizontal: '8%',
    marginTop: '10%',
  },
  username: {
    fontSize: 40,
    marginTop: '5%',
    marginHorizontal: '8%',
  },
  classcontainer: {
    backgroundColor: 'rgba(255, 251, 251, 0.21)',
    width: '85%',
    height: '100%',
    marginVertical: '10%',
    borderRadius: 20,
  },
  markButton: {
    width: '80%',
    backgroundColor: '#2f3c7c',
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: '5%',
    borderRadius: 20,
  }
});

const googlestyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  data: {
    color: '#333333',
    fontSize: 18,
    paddingLeft: 25,
    fontFamily: 'Alata Regular',
  },

});

const msstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    width: '90%',
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  data: {
    color: '#cacaca',
    fontSize: 18,
    paddingLeft: 25,
    fontFamily: 'Alata Regular',
  },
});
