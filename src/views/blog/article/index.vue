<template>
  <div class="article-container">
    <el-form :inline="true">
      <el-form-item label="分类">
        <el-select v-model="condition.categoryId" placeholder="请选择分类">
          <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="condition.tagId" placeholder="请选择标签">
          <el-option v-for="tag in tagList" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb15" :gutter="10">
      <el-col :span="1.5">
        <el-button icon="Plus" plain type="primary" @click="openModel()">新增</el-button>
      </el-col>
      <right-toolbar />
    </el-row>

    <el-table v-loading="loading" border :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="分类" prop="category" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.categoryId" placeholder="请选择">
            <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签" prop="tag">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag.id" :type="tag.type">{{ tag.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="封面" prop="thumbnail" width="120">
        <template slot-scope="scope">
          <img height="100" :src="scope.row.thumbnail" width="100" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览量" prop="viewCount" />
      <el-table-column align="center" label="点赞量" prop="likeCount" />
      <el-table-column align="center" label="评论数" prop="likeCount" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="300" />
      <el-table-column align="center" label="操作" width="300">
        <template #default="scope">
          <el-button icon="Edit" link type="primary" @click="openModel(scope.row)">编辑</el-button>
          <el-button icon="Delete" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog append-to-body :title="dialogTitle" :visible.sync="showDialog" width="500px">
      <el-form ref="categoryFormRef" label-width="100px" :model="articleForm" @submit.native.prevent>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="articleForm.name" placeholder="请输入分类名称" :rules="rules" style="width: 250px" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="articleForm.color" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="showDialog = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import Vue from 'vue'
  import { ref, reactive, toRefs, onMounted } from 'vue'
  import { getArticleList, delArticle, insertArticle, updateArticle, getTagList, getCategoryList } from '@/api/blog'

  const data = reactive({
    loading: false,
    articleList: [],
    tagList: [],
    categoryList: [],
    articleForm: {},
    dialogTitle: '',
    showDialog: false,
    condition: {},
  })

  const { loading, articleList, tagList, categoryList, articleForm, dialogTitle, showDialog, condition } = toRefs(data)
  condition.value.current = 1
  condition.value.size = 20

  const categoryFormRef = ref(null)

  // validate rules
  const rules = reactive({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  })

  const getList = () => {
    getArticleList(condition.value).then((res) => {
      articleList.value = res.data.rows
      getTagList().then((res) => {
        tagList.value = res.data
        getCategoryList().then((res) => {
          categoryList.value = res.data
        })
      })
    })
  }

  const handleSelectionChange = () => {}
  const openModel = (category) => {
    categoryFormRef.value?.clearValidate()
    if (category) {
      articleForm.value = Object.assign({}, category)
      dialogTitle.value = '编辑分类'
    } else {
      articleForm.value = {}
      dialogTitle.value = '新增分类'
    }
    showDialog.value = true
  }
  const handleDelete = (id) => {
    delArticle(id).then(() => {
      getList()
      Vue.prototype.$baseNotify('删除成功')
    })
  }

  const submitForm = () => {
    categoryFormRef.value?.validate((valid) => {
      if (valid) {
        if (articleForm.value.id) {
          console.log(articleForm.value.id)
          updateArticle(articleForm.value).then(({ data }) => {
            Vue.prototype.$baseNotify('修改成功')
            getList()
            showDialog.value = false
          })
        } else {
          insertArticle(articleForm.value).then(({ data }) => {
            Vue.prototype.$baseNotify('新增成功')
            getList()
            showDialog.value = false
          })
        }
      }
    })
  }

  onMounted(() => {
    getList()
  })
</script>

<style lang="less" scoped></style>
