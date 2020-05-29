var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    // 読み込み　strageとは、永久保存版のsessionのようなもの
  fetch: function() {
    //  読み込んだ文字列のデータをメソッドJSON.parse()によりJSONとして解析
    var todos = JSON.parse(
        // ローカルから読み込み
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    // 項目の追加・削除で抜けが出たidを連番にする
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    // つぎの項目のidを取得するため
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    //   JSON.stringify()でデータを文字列にして、Storage.setItem()により保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = new Vue({
    el: '#app',
    data: {
      todos: []
    },
    methods: {
      // ToDo 追加の処理
      doAdd: function(event, value) {
        var comment = this.$refs.comment
        // 入力がなければ何もしないで return
        if (!comment.value.length) {
          return
        }
        // todos リストへ push
        this.todos.push({
          id: todoStorage.uid++,
          comment: comment.value,
          state: 0
        })
        // フォーム要素を空にする
        comment.value = ''
      }
    }
    watch: {
      todos: {
        handler: function(todos) {
          todoStorage.save(todos)
        },
        // deep オプションでネスト(if文のなかのwhile文のなかのif文のようなもの)しているデータも監視
        deep: true
      }
    }
  })