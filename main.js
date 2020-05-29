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

new Vue({
    el: '#app',
    data: {
      todos: [],
      // 選択している options の value を記憶するためのデータ。初期値を「すべて」にする
      current: -1,
      options: [
        { value: -1, label: 'すべて' },
        { value: 0,  label: '作業中' },
        { value: 1,  label: '完了' }
      ]
    },
    
    computed: {
      computedTodos: function() {
        // データ current が -1 ならすべて、それ以外なら current と state が一致するものだけに絞り込む
        return this.todos.filter(function(el) {
          return this.current < 0 ? true : this.current === el.state
        }, this)
      },
      // 配列.reduce(function(累積値, 要素) { })
      labels() {
        return this.options.reduce(function(a, b) {
          // object.assign(第一引数,第二引数以降の全てのオブジェクトのプロパティを第一引数に指定したオブジェクトにコピー)
          return Object.assign(a, { [b.value]: b.label })
        }, {})
      }
    },

    // インスタンス作成時に自動的に fetch() する
    created() {
      this.todos = todoStorage.fetch()
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
      },
      // 状態変更の処理
      doChangeState: function(item) {
        item.state = item.state ? 0 : 1
      },
      // 削除の処理
      doRemove: function(item) {
        var index = this.todos.indexOf(item)
        this.todos.splice(index, 1)
      }
    },
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