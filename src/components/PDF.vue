<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="100%" transition="dialog-transition">
      <v-card height="620px">
        <v-card-text class="text-center">
          <canvas id="pdf-canvas"></canvas>
        </v-card-text>
        <v-card-actions>
          <span>
            <span>{{pageNum}}</span>/
            <span>{{numPages}}</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn id="zoomout" @click="zoomOut()" :disabled="zoomScale === 1">
            <v-icon color="primary">mdi-minus</v-icon>
          </v-btn>
          <v-btn id="zoomin" @click="zoomIn()" :disabled="zoomScale === 3">
            <v-icon color="primary">mdi-plus</v-icon>
          </v-btn>
          <v-btn id="prev" :disabled="pageNum === 1">
            <v-icon color="primary">mdi-arrow-left</v-icon>
          </v-btn>
          <v-btn id="next" :disabled="pageNum === numPages">
            <v-icon color="primary">mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            color="red"
            text
            class="text-none"
            @click="
              SETPREVIEWTYPE(0);
              SETPREVIEWDATA(null);
            "
          >
            {{ $t('common.closebtn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import pdfjsLib from "pdfjs-dist";

pdfjsLib.disableWorker = true;
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
let pdfDoc = null;
let canvas = "";
let ctx = "";
let pageNumPending = null;
let timeout = null;

export default {
  name: 'PDF',
  data() {
    return {
      pageNum: 0,
      numPages: 0,
      pdfDoc: null,
      isDefined: false,
      isLoaded: false,
      pageRendering: false,
      zoomScale: 1,
    };
  },
  computed: {
    ...mapState('document', ['previewType', 'previewData']),
    dialog() {
      return this.previewType === 1;
    },
  },
  watch: {
    previewData(val) {
      if (val) {
        const fileURL = URL.createObjectURL(val)
        timeout = setTimeout(() => {
          this.SET_lOADING(true);
          this.loadpdf(fileURL);
          clearTimeout(timeout);
        }, 0);
      }
      return null;
    },
  },
  methods: {
    ...mapMutations('document', ['SETPREVIEWTYPE', 'SETPREVIEWDATA']),
    ...mapMutations('setting', ['SET_lOADING']),
    renderPage(num) {
      this.pageRendering = true;
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(page => {
        let viewport = page.getViewport(1);
        viewport = page.getViewport(this.zoomScale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render PDF page into canvas context
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        let renderTask = page.render(renderContext);
        // Wait for rendering to finish
        renderTask.promise.then(() => {
          this.pageRendering = false;
          this.SET_lOADING(false);
          if (pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });
      this.isLoaded = false;
    },
    loadpdf(url) {
      pdfDoc = null;
      this.pageNum = 1;
      this.pageRendering = false;
      pageNumPending = null;
      canvas = "";
      ctx = "";
      if (!this.isDefined) {
        this.isDefined = true;
        document
          .getElementById("prev")
          .addEventListener("click", this.onPrevPage);
        document
          .getElementById("next")
          .addEventListener("click", this.onNextPage);
      }
      if (url) {
        pdfjsLib.getDocument(url).then(
          pdfDoc_ => {
            canvas = document.getElementById("pdf-canvas");
            ctx = canvas.getContext("2d");
            pdfDoc = pdfDoc_;
            this.numPages = pdfDoc.numPages;
            this.renderPage(this.pageNum);
          },
          error => {
            console.log(error, 'error');
          }
        );
      }
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage() {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    onNextPage() {
      if (this.pageNum >= pdfDoc.numPages) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    },
    zoomIn() {
      if (this.zoomScale >= 1 && this.zoomScale < 3) {
        this.zoomScale = this.zoomScale + 0.5;
        this.queueRenderPage(this.pageNum);
      }
    },
    zoomOut() {
      if (this.zoomScale >= 1.5 && this.zoomScale <= 3) {
        this.zoomScale = this.zoomScale - 0.5;
        this.queueRenderPage(this.pageNum);
      }
    },
  },
};
</script>
