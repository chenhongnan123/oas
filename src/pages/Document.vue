<template>
  <div class="document height100">
    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="documentlist"
        class="elevation-1"
        height="510"
        :items-per-page="15"
        dense
        item-key="_id"
        sort-by="name"
        :no-data-text="$t('common.notabledata')"
      >
        <template #item.action="props">
          <v-icon color="primary" @click="viewFile(props.item)">{{ 'mdi-eye' }}</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="mt-2 py-3">
      <div class="d-flex">
        <v-spacer></v-spacer>
        <div style="width:300px;z-index: 100;" class="mr-3">
          <v-select
            v-model="category"
            :items="categorylist"
            :label="$t('document.selectfolder')"
            outlined
            item-text="name"
            item-value="id"
            return-object
            hide-details
            dense
            @change="handleCategory"
          ></v-select>
        </div>
        <div class="mr-3">
          <v-btn
          color="warning"
          @click="clearCategory">
          {{$t('document.clearbtn')}}
          </v-btn>
        </div>
        <div style="width:200px;" class="mr-3">
          <v-text-field
            v-model="searchword"
            :label="$t('document.inputselectdocumenttext')"
            outlined
            clearable
            return-object
            hide-details
            dense
            @click:clear="handleCategory(category)"
          ></v-text-field>
        </div>
        <div class="mr-3">
          <v-btn
          color="primary"
          :disabled="!searchword"
          @click="handleSearch">
          {{$t('document.searchbtn')}}
          </v-btn>
        </div>
        <!-- <div class="mr-3">
          <v-btn
          color="warning"
          @click="handleCategory(category), searchword = ''">
          {{$t('document.resetbtn')}}
          </v-btn>
        </div> -->
      </div>
    </v-card>
    <image-view/>
    <pdf-view/>
  </div>
</template>

<script>
import Image from '@/components/Image';
import PDF from '@/components/PDF';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Document',
  data (){
    return {
      headers: [
        {
          text: this.$t('document.foldername'),
          sortable: false,
          value: 'foldername',
        },
        {
          text: this.$t('document.documentname'),
          value: 'name',
        },
        {
          text: this.$t('document.documenttype'),
          sortable: false,
          value: 'type',
        },
        {
          text: this.$t('document.extension'),
          sortable: false,
          value: 'extension',
        },
        {
          text: this.$t('document.version'),
          sortable: false,
          value: 'version',
        },
        {
          text: this.$t('document.action'),
          sortable: false,
          value: 'action',
        },
      ],
      documentlist: [],
      categorylist: [],
      category: null,
      searchword: '',
    }
  },
  components: {
    ImageView: Image,
    PdfView: PDF
    
  },
  computed: {
    ...mapState({
      machinename: state => state.setting.machinename,
      currentplan: state => state.plan.currentplan,
    }),
  },
  methods: {
    ...mapActions({
      GET_ASSET_DOCUMENTS: 'document/GET_ASSET_DOCUMENTS',
      GET_PART_DOCUMENTS: 'document/GET_PART_DOCUMENTS',
      GET_CATEGORYS: 'document/GET_CATEGORYS',
      GET_DOCUMENTS: 'document/GET_DOCUMENTS',
      DOWNLOADFILE: 'document/DOWNLOADFILE',
    }),
    ...mapMutations('document', ['SETPREVIEWTYPE', 'SETPREVIEWDATA']),
    async getInitalDocuments() {
      const {
        machinename,
        currentplan,
      } = this;
      const assetdocumentlist = await this.GET_ASSET_DOCUMENTS(`?query=machinename==%22${machinename}%22`);
      let partdocumentlist = [];
      if (currentplan.length > 0) {
        partdocumentlist = await this.GET_PART_DOCUMENTS(`?query=partname==%22${currentplan[0].partname}%22`);
      }
      this.documentlist = [...assetdocumentlist, ...partdocumentlist]
      .map(item => ({
        ...item,
        name: item.documentname
      }));
    },
    async viewFile(item) {
      const documentlist = await this.GET_DOCUMENTS(`?query=name=="${encodeURIComponent(item.name)}"`);
      if (documentlist.length === 0) {
        return;
      }
      const document = documentlist.sort((a,b) => Number(b) - Number(a))[0];
      const viewdata = await this.DOWNLOADFILE(document.url);
      if (document.extension === 'pdf') {
        this.SETPREVIEWTYPE(1);
      } else {
        this.SETPREVIEWTYPE(2);
      }
      this.SETPREVIEWDATA(viewdata);
    },
    async handleCategory(category) {
      if (category) {
        const param = `?query=folderid==%22${category.id}%22`;
        this.documentlist = await this.GET_DOCUMENTS(param);
      } else {
        this.getInitalDocuments();
      }
      this.searchword = '';
    },
    handleSearch() {
      const { searchword, documentlist } = this;
      this.documentlist = documentlist.filter(item => 
      item.name.indexOf(searchword.toLocaleLowerCase()) !== -1
      || item.name.indexOf(searchword.toUpperCase()) !== -1
      );
    },
    clearCategory() {
      this.category = null;
      this.searchword = '';
      this.getInitalDocuments();
    },
  },
  async created() {
    this.categorylist = await this.GET_CATEGORYS();
    this.getInitalDocuments();
    console.log(this.categorylist, 'this.categorylist');
  },
}
</script>
<style lang="scss">
.rejection{
  .lineheight{
    line-height: 20px;
  }
}
</style>
