import {InputValidator} from "./inputValidator"
import { ValidationUI } from "../types/validationUI";
import axios from "../../../node_modules/axios/index";

// --- dom element --- 
const registrationForm = document.querySelector("#registrationForm") as HTMLFormElement;
const emailCheckBtn    = document.querySelector("#emailCheckBtn")    as HTMLButtonElement;
const emailDoman       = document.querySelector("#email")            as HTMLInputElement;
const emailId          = document.querySelector("#emailId")          as HTMLInputElement;
const name             = document.querySelector("#name")             as HTMLInputElement;
const password         = document.querySelector("#password")         as HTMLInputElement;
const rePassword       = document.querySelector("#rePassword")       as HTMLInputElement;
const submitBtn        = document.querySelector("#submitBtn")        as HTMLButtonElement;
const emailValidMsg    = document.querySelector("#emailValidMsg")    as HTMLDivElement;
const nameValidMsg     = document.querySelector("#nameValidMsg")     as HTMLDivElement;
const passwordValidMsg = document.querySelector("#passwordValidMsg") as HTMLDivElement;
const formValidMsg     = document.querySelector("#formValidMsg")     as HTMLDivElement;
//------

// --- const variables ---
const pwLengthLimit   :number = 7;
const nameLengthLimit :number = 2;
// ---

function isSamePassword(pw1 :HTMLInputElement ,pw2 :HTMLInputElement ) :boolean{
    return pw1.value == pw2.value;
}

function passwordShouldMatch() :void{
    rePassword.addEventListener("keyup",()=>{
        isSamePassword(password,rePassword) ?  InputValidator.displayValid(rePassword) : InputValidator.displayInvalid(rePassword);
})};

function isEmpty(dom :HTMLInputElement) :boolean {
    return dom.value.length <= 0;
}
function isAlphabetInString(input :string){
    const ALPHA_REGEXP     = /[a-zA-Z]/g
    return ALPHA_REGEXP.test(input);
}
function inputLengthShorterThen(dom : HTMLInputElement ,length :number) : boolean{
    return dom.value.length < length;
}
// ????????? ????????? ?????? ??? ??????????????? ??????????????? 
function validateFormDataBeforeSubmit() : void{
    submitBtn.addEventListener("click",()=>{
        if(emailCheckBtn.getAttribute("data-checked") == "false"){
            return InputValidator.appendInValidMsg(emailValidMsg,"????????? ???????????? ????????????");
        }
        let inputList :Array<HTMLInputElement> = [emailId,emailDoman,name,password,rePassword];
        for (let dom of inputList){
            if(isEmpty(dom)){
                InputValidator.displayInvalid(dom);
                return InputValidator.appendInValidMsg(formValidMsg,"?????? ?????? ????????? ??????????????????.");
            }
            if(dom == name){
                if(inputLengthShorterThen(name,nameLengthLimit)){
                    return InputValidator.appendInValidMsg(nameValidMsg,`?????? ????????? ?????? ${nameLengthLimit}??????????????? ?????????.`);
                }
            }
            else if(dom == password){
                if(inputLengthShorterThen(dom,pwLengthLimit)){
                 return InputValidator.appendInValidMsg(passwordValidMsg,`???????????? ????????? ?????? ${pwLengthLimit}??????????????? ?????????.`);
                }
                if(!isAlphabetInString(dom.value)){
                 return InputValidator.appendInValidMsg(passwordValidMsg,"??????????????? ???????????? ????????? ???????????? ??????????????? ?????????.");
                }
                if(dom.classList.contains(ValidationUI.FAIL_BORDER_COLOR)){
                  return InputValidator.appendInValidMsg(passwordValidMsg,"???????????? ??????????????? ???????????? ????????????.");
                }
            }
        }
        registrationForm.submit();  
    })
}

function isDuplicateEmail() :void {
    emailCheckBtn.addEventListener("click",()=>{       
        // ????????? ???????????? ????????? ??????????????? ?????? process?????? ????????? ???????????? ????????????. 
        if(!(emailId.value && emailId.value)){
            InputValidator.displayInvalid(emailId);
            return;      
        }
        axios.post("/user/email",
                    {
                        email: `${emailId.value}@${emailDoman.value}`,
                    }
                )
            .then((rs :any)=>{
                if(rs.data['isNotDuplicate']){
                    InputValidator.displayValid(emailId)
                    InputValidator.appendValidMsg(emailValidMsg,"??????????????? ??????????????????.");
                    emailCheckBtn.setAttribute("data-checked","true");
                }
                else{
                    InputValidator.displayInvalid(emailId);
                    InputValidator.appendInValidMsg(emailValidMsg,"????????? ??????????????????.");
                    emailCheckBtn.setAttribute("data-checked","false");
                }    
            });
    })
}

isDuplicateEmail();
passwordShouldMatch();
validateFormDataBeforeSubmit();

