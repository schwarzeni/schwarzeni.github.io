// 评论插件擅自插入广告，去死吧
// (function() {
//   var interval = setInterval(function() {
//     var adroot = document.getElementById("taboola-livere");
//     if (adroot != null) {
//       if (adroot.remove != null) {
//         adroot.remove();
//       } else {
//         adroot.style.display = "none";
//       }
//       clearInterval(interval);
//     }
//   }, 1000);
// })();

// 创建容器
var powerfulPluginContainer = document.createElement('div');
powerfulPluginContainer.setAttribute("class", "powerful-plugin-container");
document.body.appendChild(powerfulPluginContainer);


// ============================================================
// 适配手机端，解决fixed不起作用的问题，顺便删除动画效果
(function(){
  Array.from(document.getElementById('main').children).forEach(function(v) {
    v.style = "";
    if (v.getAttribute('class') !== null)
      v.setAttribute('class', v.getAttribute('class').substring(4))
  });
  var clearFix = document.createElement('div')
  clearFix.style.position = "absolute"
  document.getElementsByClassName('powerful-plugin-container')[0].appendChild(clearFix);
})();


// ============================================================
// 控制所有按钮是否显示组件
// TOOD: 提出所有按钮的id
// 前一个函数加 ；
(function(){
  var parabtn = document.createElement('div')
  const BAR_HIDE = "BAR_HIDE"
  const BAR_SHOW = "BAR_SHOW"
  const KEY_BAR_STATUS = 'bar_status'
  powerfulPluginContainer.appendChild(parabtn);
  parabtn.setAttribute("id", "ssp_hide_all_btn");
  parabtn.setAttribute("class", "ssp-self-opt-btn");
  // 记录侧栏是否隐藏
  var sidebarStatus = window.localStorage.getItem(KEY_BAR_STATUS)
  if (!sidebarStatus) {
    sidebarStatus = BAR_SHOW
    window.localStorage.setItem(KEY_BAR_STATUS, sidebarStatus)
  }
  toggleSideBar()

  parabtn.onclick = function() {
    changeBarStatus()
    toggleSideBar()
    window.localStorage.setItem(KEY_BAR_STATUS, sidebarStatus)
  }

  function toggleSideBar() {
    if (sidebarStatus == BAR_SHOW) {
      // 无视
      powerfulPluginContainer.style.left = "";
      parabtn.style.position = "";
      parabtn.style.left = "";
      parabtn.style.backgroundImage = "url('/third-party/powerful-sidebar-util/icon/hideBtns.png')"
    } else if (sidebarStatus == BAR_HIDE){
      powerfulPluginContainer.style.left = "-50px";
      parabtn.style.backgroundImage = "";
      setTimeout(function() {
        parabtn.style.position = "absolute";
        parabtn.style.left = "35px";
      }, 400)
    }
  }

  function changeBarStatus() {
    if (sidebarStatus == BAR_SHOW) {
      sidebarStatus = BAR_HIDE
    } else if (sidebarStatus == BAR_HIDE) {
      sidebarStatus = BAR_SHOW
    }
  }
})();


/**
 * 回到顶部功能
 */
(function () {
  var para1 = document.createElement('div')
  powerfulPluginContainer.appendChild(para1);
  para1.setAttribute("id", "ssp_opt_to_top_btn");
  para1.setAttribute("class", "ssp-self-opt-btn");
  para1.onclick = function () {
    timer = setInterval(function () {
      //获取滚动条距离顶部的高度
      var osTop = document.documentElement.scrollTop || document.body.scrollTop;
      var ispeed = Math.floor(-osTop / 5);
      isTop = true;
      document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
      if (osTop == 0) {
        clearInterval(timer);
      }
    }, 30);
  };
})();

/**
 * 文章全屏设置
 */
(function () {
  var pageStatus = 0;
  var para = document.createElement('div')
  if (window.innerWidth >= 980) {
    powerfulPluginContainer.appendChild(para)
    para.setAttribute("id", "ssp_opt_article_btn");
    para.setAttribute("class", "ssp-self-opt-btn");
    para.onclick = function () {
      var main = document.getElementById('main');
      var sideBar = document.getElementById('sidebar');
      main.removeAttribute('style');
      sideBar.removeAttribute('style');
      para.removeAttribute('style');
      if (pageStatus == 0) {
        main.style.width = "100%";
        main.style.transition = "width .4s";
        sideBar.style.display = "none";
        para.style.backgroundImage = "url('/third-party/powerful-sidebar-util/icon/fullscreenexit.png')"
        pageStatus = 1;
      } else {
        main.style.transition = "width .4s";
        pageStatus = 0;
      }
    }
    // 如果是文章界面，自动全屏
    if (window.location.href.match(/[\w:\/\.]+[\d]+\/.*/) !== null  ) {
      para.click();
    }
    // 足迹页全屏
    if ( window.location.href.indexOf('plans') !== -1) {
      para.click();
    }
  }
})();


/**
 * 显示目录
 */
(function () {
  function isArchive() {
    return window.location.pathname.match(/\/tags\/.+/) !== null
      || window.location.pathname === '/archives/'
      || window.location.pathname.match(/\/categories\/.+/) !== null
  }
  if (
    window.location.href.match(/[\w:\/\.]+[\d]+\/.*/) !== null
      || window.location.href.indexOf('plans') !== -1
      || isArchive()
      ) {

    var articleMenuBtn = document.createElement('div')
    powerfulPluginContainer.appendChild(articleMenuBtn);
    var aritcleMenuContainer = document.createElement("div");
    aritcleMenuContainer.setAttribute("id", "ssp_article_menu_container");

    var rootElem = document.getElementsByClassName('article-entry')[0];
    var headerList = generateHeaderList(rootElem);
    if (isArchive()) {
      // 处理 archives 页的情况
      headerList = Array.from(document.getElementsByClassName('archive-year-h'))
    }
    // 如果没有标题则不生成
    if (!headerList || headerList.length === 0) {
      return;
    }

    powerfulPluginContainer.appendChild(aritcleMenuContainer);
    generateElement(aritcleMenuContainer, headerList);

    articleMenuBtn.setAttribute("id", "ssp_article_menu_btn");
    articleMenuBtn.setAttribute("class", "ssp-self-opt-btn");

    var isHidden = true;
    var menuContainerHiddenCssClass = "ssp-article-menu-container ssp-article-menu-container-hide"
    var menuContainerShowCssClass = "  ssp-article-menu-container ssp-article-menu-container-show"
    aritcleMenuContainer.setAttribute("class", menuContainerHiddenCssClass);

    // 绑定事件
    articleMenuBtn.onclick = function () {
      isHidden = !isHidden;
      toggleArticleMenu();
      toggleArticleMenuIcon();
    }
    aritcleMenuContainer.onclick = function () {
      isHidden = true;
      toggleArticleMenu();
      toggleArticleMenuIcon();
    }

    articleMenuBtn.onclick = function () {
      articleMenuBtn.removeAttribute("style");
      isHidden = !isHidden;
      toggleArticleMenu();
      toggleArticleMenuIcon();
    }

    function toggleArticleMenu() {
      if (isHidden) {
        aritcleMenuContainer.setAttribute("class", menuContainerHiddenCssClass);
      } else {
        aritcleMenuContainer.setAttribute("class", menuContainerShowCssClass);
      }
    }

    function toggleArticleMenuIcon() {
      if (isHidden) {
        articleMenuBtn.style.backgroundImage = "url('/third-party/powerful-sidebar-util/icon/article_menu_show.png')";
      } else {
        articleMenuBtn.style.backgroundImage = "url('/third-party/powerful-sidebar-util/icon/article_menu_hide.png')";
      }
    }



    /**
     * 获取所有header节点
     * @param {Element} rootElem  根节点
     * @returns {Array<Element>}  获取的标题节点
     */
    function generateHeaderList(rootElem) {
      if (rootElem === null || rootElem === undefined || rootElem.children === undefined) {
        return [];
      }
      var childrenList = Array.from(rootElem.children);
      var childNode;
      return childrenList.filter(function (childNode) {
        var nodeName = childNode.nodeName;
        return nodeName.match(/[hH]\d/);
      })
    }

    /**
     * 生成目录
     * @param {Element} containerElem 容器元素，生成的目录存放在里面
     * @param {Array<Element>} headerList 包含header元素的list
     */
    function generateElement(containerElem, headerList) {
      var headerElement;
      var menuListItem;
      var level;
      var rootLevel;
      var iconArr = ['🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '🍀', '🎋', '🍃', '🍂', '🍁', '🌾', '🌺', '🌻', '🌹', '🥀', '🌷', '🌼', '🌸', '💐', '🍄', '🌰', '🎃', '🐚', '🌎', '🕸'];
      for (var i = 0; i < headerList.length; i++) {
        // h4以及更小的header不做处理
        headerElement = headerList[i];
        var level = headerElement.tagName.substring(1) - "0";
        if (level - 3 <= 0) {
          if (0 === i) {
            rootLevel = level;
          }


          // 生成目录元素
          menuListItem = document.createElement("a");
          // 设置内容
          var idx = getRandomInt(0, iconArr.length - 1);
          menuListItem.textContent = iconArr[idx] + ' ' + headerElement.textContent;
          // 设置导航目的地
          menuListItem.setAttribute("href", "#" + headerElement.getAttribute("id"))
          // 设置css样式
          var cssClassName = "spp-h-common " + "spp-h-" + (level - rootLevel + 1);
          menuListItem.setAttribute("class", cssClassName);
          containerElem.appendChild(menuListItem);
        }
      }
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
})();



// ============================================================
// 搜索框部分



(function () {
    // 搜索包括的内容：0：titles  1：tas   2：categorie
  var searchInclued = {
    title: true,
    tags: false,
    categories: false
  };

  var searchAreaHtml = '<div class="ssp-search-container" id="ssp_search_container"style="height: 0;overflow: hidden;" ><div id="ssp_search_close_btn" class="ssp-search-close-btn"></div>'
  + '<span data="0" class="ssp-search-sort '
      + (searchInclued.title ? ' ssp-search-sort-select ' : '')
  + '">标题</span> '
  + '<span data="1" class="ssp-search-sort '
      + (searchInclued.tags ? ' ssp-search-sort-select ' : '' )
  + '">标签</span> '
  + '<span data="2" class="ssp-search-sort '
      + (searchInclued.categories ? ' ssp-search-sort-select ' : '' )
  + '">分类</span> '
  + '<input type="text" id="ssp_search_input_area" class="ssp-search-input-area"><div class="ssp-search-result-container" id="ssp_search_result_container"></div></div>';

  var openBtn = document.createElement('div')
  powerfulPluginContainer.appendChild(openBtn);
  openBtn.setAttribute("id", "ssp_search_open_btn");
  openBtn.setAttribute("class", "ssp-self-opt-btn");

  var searchArea = document.createElement('div');
  searchArea.setAttribute("class", "ssp-search-area");
  searchArea.setAttribute("id", "ssp_search_area");
  searchArea.setAttribute("style", "width: 0;");
  searchArea.innerHTML = searchAreaHtml;
  document.body.appendChild(searchArea);

  var rooturl = "";
  var filename = "search.json";
  var getDataUrl = rooturl + "/" + filename;
  var openSearchArea = false;
  var searchArea = document.getElementById("ssp_search_area");
  var searchAreaContainer = document.getElementById("ssp_search_container");

  // 打开搜索区域
  openBtn.onclick = function () {
    searchArea.removeAttribute("style");
    searchAreaContainer.removeAttribute("style");
  }

  // var searchInclued = [2];

  /**
   * 单个搜索结果的封装
   * @param {Object} data 数据
   * @param {number} weight 权重
   */
  function ResultItem(data, weight) {
    this.data = data;
    this.weight = weight;
  }

  /**
   * 对全部搜索结果的封装
   */
  function ResultItemList() {
    this.itemList = [];
  }
  /**
   * 插入数据
   * @param{ResultItem} 需要插入的数据
   */
  ResultItemList.prototype.insert = function(item) {
    var idx = 0;
    while (idx < this.itemList.length) {
      if (this.itemList[idx].weight <= item.weight) {
        break;
      }
      idx++;
    }
    this.itemList.splice(idx, 0, item);
  };

  /**
   * 获取数组
   */
  ResultItemList.prototype.toArray = function () {
    var items = [];
    for (var i = 0; i < this.itemList.length; i++) {
      items.push(this.itemList[i].data)
    }
    return items;
  };

  // 函数主入口
  (function () {
    var inputItem = document.getElementById("ssp_search_input_area");
    var resultContainer = document.getElementById("ssp_search_result_container");
    var data;


    // 获取数据
    axios.get(getDataUrl + "?p=" + (new Date()))
      .then(function (resp) {
        data = resp.data;
        if (inputItem !== undefined) {
          // 获取数据成功才绑定事件
          inputItem.addEventListener("keyup", function () {
            goSearch();
          })
        }
      }).catch(function (resp) {
        // TODO: 处理错误
        console.log(resp);
      })


    // 设置关闭按钮
    document.getElementById("ssp_search_close_btn").onclick = function (ev) {
      searchArea.removeAttribute("style");
      searchAreaContainer.removeAttribute("style");
      searchArea.style.width = 0;
      searchAreaContainer.style.height = 0;
      searchAreaContainer.style.overflow = "hidden";
    }

    // 选择搜索范围
    var selections = document.getElementsByClassName("ssp-search-sort");
    for (var i = 0; i < selections.length; i++) {
      attachEventToOptionSelector(selections[i]);
    }


    function goSearch() {
      if (inputItem.value.trim() !== "") {
        resultContainer.innerHTML = "";
        var userInputValue = inputItem.value.split(" ");
        var result = searchJson(userInputValue, data);
        generateView(resultContainer, result)
      }
    }


    /**
     * 对数据进行搜索
     *  @param search 需要搜索的内容,数组形式
     * @param {Array} jsonData 全部数据
     */
    function searchJson(search, jsonData) {
      if (search === undefined || jsonData === undefined || jsonData.length === 0) {
        return []
      }
      var resultItemList = new ResultItemList();
      var weight = 0
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i] === undefined) {
          continue;
        }
        if ((weight = searchWeight(search, jsonData[i])) > 0) {
          resultItemList.insert(new ResultItem(jsonData[i], weight));
        }
      }
      return resultItemList.toArray();
    }

    /**
     * 对单个数据进行搜索
     * @param search         要搜索内容
     * @param jsonDataItem 单个json数据
     * @return {number} 返回权重 0 --> 3  min --> max
     */
    function searchWeight(search, jsonDataItem) {
      if (searchInclued === undefined || searchInclued.length === 0 || search === undefined || jsonDataItem === undefined) {
        return;
      }

      var searchItem = [];
      // 从单个json中根据配置获取数据
      if (searchInclued.title) {
        searchItem.push(jsonDataItem.title);
      }
      if (searchInclued.tags) {
        searchItem = Array.prototype.concat(searchItem, jsonDataItem.tags);
      }
      if (searchInclued.categories) {
        searchItem = Array.prototype.concat(searchItem, jsonDataItem.categories)
      }
      // 进行搜索
      // 权重
      var weight = 0;
      for (var j = 0; j < searchItem.length; j++) {
        for (var k = 0; k < search.length; k++) {
          if (compareStr(search[k], searchItem[j])) {
            weight++;
          }
        }
      }
      return weight;
    }

    /**
     * 比较两字符串是否相等，不是大小写
     * @param str1
     * @param str2
     */
    function compareStr(str1, str2) {
      if (str1 === str2) {
        return true;
      }
      if (str1 === undefined || str2 === undefined) {
        return false;
      }
      return str1.toUpperCase().indexOf(str2.toUpperCase()) !== -1 ||
        str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1 ||
        str2.toUpperCase().indexOf(str1.toUpperCase()) !== -1 ||
        str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1
    }

    /**
     * 生成html图像
     * @param {Element} rootElem
     * @param  {Array} data
     */
    function generateView(rootElem, data) {
      if (data === undefined || data.length === 0 || rootElem === undefined) {
        return;
      }
      for (var i = 0; i < data.length; i++) {
        rootElem.appendChild(generateListItemView(data[i]));
      }
    }

    /**
     * 生成单个列表元素
     * @param data
     * @return {Element}
     */
    function generateListItemView(data) {
      var aElem = document.createElement("a");
      aElem.setAttribute("class", "ssp-search-result-item");
      aElem.setAttribute("href", rooturl + data.url);

      // 标题
      var nameContainer = document.createElement("div");
      nameContainer.setAttribute("class", "ssp-search-result-item-title");
      nameContainer.innerText = data.title;
      // 具体信息
      var infoContainer = document.createElement("div");
      var i = 0;
      var infoItemContainer;
      // 添加tag信息
      if (data.tags !== undefined) {
        for (; i < data.tags.length; i++) {
          infoItemContainer = document.createElement("span");
          infoItemContainer.innerText = data.tags[i];
          infoContainer.appendChild(infoItemContainer);
          infoItemContainer.setAttribute("class", "ssp-search-result-item-tag");
        }
      }

      // 添加category信息
      if (data.categories !== undefined) {
        for (i = 0; i < data.categories.length; i++) {
          infoItemContainer = document.createElement("span");
          infoItemContainer.innerText = data.categories[i];
          infoContainer.appendChild(infoItemContainer);
          infoItemContainer.setAttribute("class", "ssp-search-result-item-category");
        }
      }

      aElem.appendChild(nameContainer);
      aElem.appendChild(infoContainer);
      return aElem;
    }

    /**
     * 为搜索范围选项绑定事件
     * @param  {Element} element
     */
    function attachEventToOptionSelector(element) {
      if (element === undefined) return;
      var options = element.getAttribute("data");
      var unselectClass = "ssp-search-sort";
      var selectClass = "ssp-search-sort ssp-search-sort-select";

      // TODO: 简化代码
      if (options === "0") {
        element.addEventListener("click", function () {
          var tmpClass;
          element.removeAttribute("class");
          tmpClass = searchInclued.title ? unselectClass : selectClass;
          searchInclued.title = !searchInclued.title;
          element.setAttribute("class", tmpClass);
          goSearch();
        });
      } else if (options === "1") {
        element.addEventListener("click", function () {
          var tmpClass;
          element.removeAttribute("class");
          tmpClass = searchInclued.tags ? unselectClass : selectClass;
          searchInclued.tags = !searchInclued.tags;
          element.setAttribute("class", tmpClass);
          goSearch();
        });
      } else if (options === "2") {
        element.addEventListener("click", function () {
          var tmpClass;
          element.removeAttribute("class");
          tmpClass = searchInclued.categories ? unselectClass : selectClass;
          searchInclued.categories = !searchInclued.categories;
          element.setAttribute("class", tmpClass);
          goSearch();
        });
      }
    }

  })();
})();

// ============================================================
//

