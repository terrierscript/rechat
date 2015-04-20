import { Flummox, Store, Actions } from "flummox"
import Keys from "./keys"

class Ask{
  constructor(questions){
    this.questions = questions
    this.answers = {}
  }
  answer(question, answer){
    this.answers[question] = answer
  }
  askedIndex(){
    for(let i = 0; i < this.questions.length; i++){
      var q = this.questions[i]
      if(!this.answers[q.name]){
        return i
      }
    }
    return this.questions.length
  }
  getNextAsk(){
    return this.questions[this.askedIndex()]
  }
  dummyMessage(msgs){
    return msgs.map((msg) => {
      return {
        message: msg
      }
    })
  }
  buildMessages(){
    var messages = []
    var qs = this.questions.slice(0, this.askedIndex() + 1)
    qs.forEach((q) => {
      messages.push({
        message: q.message,
        type: "question"
      })
      if(this.answers[q.name]){
        messages.push({
          message: this.answers[q.name],
          type: "answer"
        })
      }
    })
    return messages
  }
}

let askInstance = new Ask([
  {
    name: "size",
    message: "大きさは？",
    type: "select",
    options: ["大型犬", "小型犬", "中型犬"]
  },
  {
    name: "name",
    message: "お名前を教えて下さい",
    placeholder: "名前を入力",
    type: "input"
  },
  {
    name: "kana",
    message: "ふりがなも教えて下さい",
    placeholder: "ふりがなを入力",
    type: "input"
  }
])

class AppActions extends Actions {
  answer(name, value) {
    return { name: name, value: value }
  }
}

class AskStore extends Store {
  constructor(flux, ask) {
    super()
    const messageActions = flux.getActions(Keys.ask)
    this.register(messageActions.answer, this.handleNewMessage);
    this.ask = ask
    this.state = {
      messages: this.ask.buildMessages()
    };
  }
  getMessages(){
    return this.state.messages
  }
  getNextAsk(){
    return this.ask.getNextAsk()
  }
  handleNewMessage(content) {
    this.ask.answer(content.name, content.value)
    this.setState({
      messages: this.ask.buildMessages()
      // [id]: {
      //   content,
      //   id
      // }
    })
  }
}


export default class extends Flummox {
  constructor() {
    super();

    this.createActions(Keys.ask, AppActions)
    this.createStore(Keys.ask, AskStore, this, askInstance)

    // this.createActions("messages", MessageActions)
    // this.createStore("messages", MessageStore, this)
  }
}
