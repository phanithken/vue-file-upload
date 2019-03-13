import { Observable, from } from 'rxjs'
import { catchError } from 'rxjs/operators'
import firebase from 'firebase/app'
import 'firebase/storage'

function randString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const uploadImage = (image) => from(firebase.storage().ref(randString()).putString(image, 'data_url'))
                                        .pipe(
                                            catchError((error) => console.log(error))
                                        )