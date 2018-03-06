
function $(a,c) {
    if ( a == null ) return;
    // Since we're using Prototype's $ function,
    // be nice and have backwards compatability
    if ( typeof Prototype != "undefined" && a.constructor == String ) {
        var re = new RegExp( "[^a-zA-Z0-9_-]" );
        if ( !re.test(a) ) {
            var c = ((c&&c.documentElement) || document);
            if ( c.getElementsByTagName(a).length == 0 ) {
                var obj = c.getElementById(a);
                if ( obj != null ) return obj;
            }
        }
    }
    // Load Dynamic Function List
    var self = {
        cur: $.Select(a,c),
        
        // The only two getters
        size: function() {
            return this.get().length;
        },
        get: function(i) {
            if ( i == null )
                return this.$$unclean ? $.sibling(this.$$unclean[0]) : this.cur;
            else
                return (this.get())[i];
        },
        "_get": function(i) {
            if ( i == null )
                return this.cur;
            else
                return this.cur[i];
        },
        
        each: function(f) {
            for ( var i = 0; this.cur && i < this._get().length; i++ ) {
                if ( this._get(i) ) {
                    this._get(i).$$tmpFunc = f;
                    this._get(i).$$tmpFunc(i);
                    this._get(i).$$tmpFunc = null;
                }
            }
            return this;
        },
        set: function(a,b) {
            return this.each(function(){
                if ( b == null )
                    for ( var j in a )
                        this[j] = a[j];
                else {
                    if ( b.constructor != String ) {
                        for ( var i in b ) {    
                            var c = $.Select(i,this);
                            for ( var j in c )
                                c[j][a] = b[i];
                        }
                    } else
                      this[a] = b;
                }
            });
        },
        html: function(h) {
            return this.set( "innerHTML", h );
        },
        // Deprecated
        style: function(a,b){ return this.css(a,b); },
        
        css: function(a,b) {
            return this.each(function(){
                if ( !b )
                    for ( var j in a )
                        this.style[j] = a[j];
                else
                    this.style[a] = b;
            });
        },
        toggle: function() {
            return this.each(function(){
                var d = $.getCSS(this,"display");
                if ( d == "none" || d == '' )
                    $(this).show();
                else
                    $(this).hide();
            });
        },
        show: function(a) {
            return this.each(function(){
                this.style.display = this.$$oldblock ? this.$$oldblock : 'block';
            });
        },
        hide: function(a) {
            return this.each(function(){
                this.$$oldblock = $.getCSS(this,"display");
                this.style.display = 'none';
            });
        },
        addClass: function(c) {
            return this.each(function(){
                if ($.hasWord(this,c)) return;
                this.className += ( this.className.length > 0 ? " " : "" ) + c;
            });
        },
        removeClass: function(c) {
            return this.each(function(){
                if (!$.hasWord(this,c)) return;
                var ret = "";
                var s = this.className.split( " " );
                for ( var i = 0; i < s.length; i++ )
                    if ( s[i] != c )
                        ret += ( ret.length > 0 ? " " : "" ) + s[i];
                this.className = ret;
            });
        },
        remove: function() {
            this.each(function(){this.parentNode.removeChild( this );});
            this.cur = [];
            return this;
        },
        
        wrap: function() {
            var a = $.clean(arguments);
            return this.each(function(){
                var b = a[0].cloneNode(true);
                this.parentNode.insertBefore( b, this );
                while ( b.firstChild ) b = b.firstChild;
                b.appendChild( this );
            });
        },
        
        append: function() {
            var a = $.clean(arguments);
            return this.each(function(){
                for ( var i in a )
                    if ( a[i].cloneNode != null )
                    this.appendChild( a[i].cloneNode(true) );
            });
        },
        appendTo: function() {
            var self = this;
            var a = arguments;
            return this.each(function(){
                for ( var i = 0; i < a.length; i++ ) {
                    if ( self.$$unclean )
                      $(a[i]).append( self.get() );
                    else
                      $(a[i]).append( this );
                }
            });
        },
        
        prepend: function() {
            var a = $.clean(arguments);
            return this.each(function(){
                for ( var i = a.length - 1; i >= 0; i-- )
                    this.insertBefore( a[i].cloneNode(true), this.firstChild );
            });
        },
        
        before: function() {
            var a = $.clean(arguments);
            return this.each(function(){
                for ( var i in a )
                    this.parentNode.insertBefore( a[i].cloneNode(true), this );
            });
        },
        
        after: function() {
            var a = $.clean(arguments);
            return this.each(function(){
                for ( var i = a.length - 1; i >= 0; i-- )
                    this.parentNode.insertBefore( a[i].cloneNode(true), this.nextSibling );
            });
        },
        
        bind: function(t,f) {
            return this.each(function(){addEvent(this,t,f);});
        },
        unbind: function(t,f) {
            return this.each(function(){removeEvent(this,t,f);});
        },
        
        find: function(t) {
            var old = [], ret = [];
            this.each(function(){
                old.push( this );
                ret = $.merge( ret, $.Select(t,this) );
            });
            this.old = old;
            this.cur = ret;
            return this;
        },
        end: function() {
            this.cur = this.old;
            return this;
        },
        filter: function(t) {
            this.cur = $.filter(t,this.cur).r;
            return this;
        },
        not: function(t) {
            if ( t.constructor == String )
                this.cur = $.filter(t,this.cur,false).r;
            else
                this.cur = $.grep(this.cur,function(a){return a != t;});
            return this;
        },
        add: function(t) {
            if ( t.constructor == String )
                this.cur = $.merge(this.cur,$.Select(t));
            else if ( t.constructor == Array )
                this.cur = $.merge(this.cur,t);
            else
                this.cur = $.merge(this.cur,new Array(t));
            return this;
        }
    };
    for ( var i in $.fn ) {
        if ( self[i] != null )
            self["_"+i] = self[i];
        self[i] = $.fn[i];
    }
    
    if ( typeof Prototype != "undefined" && a.constructor != String ) {
        for ( var i in self ) {(function(j){
            try {
                if ( j.indexOf('on') != 0 || j == "onready" ) {
                    a[j] = function() {
                        return self[j].apply(self,arguments);
                    };
                }
            } catch (e){}
        })(i);}
        return a;
    }
    
    return self;
}
function $C(a) {
  if ( a.indexOf('<') >= 0 ) {
    if ( a.indexOf('<tr') >= 0 ) {
      var r = $C("table").html("<tbody>"+a+"</tbody>");
      r.$$unclean = r.get(0).childNodes[0].childNodes;
    } else {
      var r = $C("div").html(a);
      r.$$unclean = r.get(0).childNodes;
    }
    return r;
  } else {
    return $(document.createElement(a),document);
  }
}
$.getCSS = function(e,p) {
  if (e.style[p])
    return e.style[p];
  else if (e.currentStyle)
    return e.currentStyle[p];
  else if (document.defaultView && document.defaultView.getComputedStyle) {
    p = p.replace(/([A-Z])/g,"-$1");
    p = p.toLowerCase();
    return document.defaultView.getComputedStyle(e,"").getPropertyValue(p);
  } else
    return null;
};
$.clean = function(a) {
    var r = new Array();
    for ( var i = 0; i < a.length; i++ ) {
        if ( a[i].constructor == String ) {
            //a[i] = a[i].replace( /#([a-zA-Z0-9_-]+)/g, " id='$1' " );
            //a[i] = a[i].replace( /\.([a-zA-Z0-9_-]+)/g, " class='$1' " );
            var div = document.createElement("div");
            div.innerHTML = a[i];
            for ( var j = 0; j < div.childNodes.length; j++ )
                r.push( div.childNodes[j] );
        } else if ( a[i].length ) {
            for ( var j = 0; j < a[i].length; j++ )
                r.push( a[i][j] );
        } else {
            r.push( a[i] ); //.cloneNode(true) );
        }
    }
    return r;
};
$.g = {
    '': "m[2] == '*' || a.nodeName.toUpperCase() == m[2].toUpperCase()",
    '#': "a.id == m[2]",
    ':': {
        lt: "i < m[3]-0",
        gt: "i > m[3]-0",
        nth: "m[3] - 0 == i",
        eq: "m[3] - 0 == i",
        first: "i == 0",
        last: "i == r.length - 1",
        even: "i % 2 == 0",
        odd: "i % 2 == 1",
        "first-child": "$.sibling(a,0).cur",
        "nth-child": "(m[3] == 'even'?$.sibling(a,m[3]).n % 2 == 0 :(m[3] == 'odd'?$.sibling(a,m[3]).n % 2 == 1:$.sibling(a,m[3]).cur))",
        "last-child": "$.sibling(a,0,true).cur",
        "nth-last-child": "$.sibling(a,m[3],true).cur",
        "first-of-type": "$.ofType(a,0)",
        "nth-of-type": "$.ofType(a,m[3])",
        "last-of-type": "$.ofType(a,0,true)",
        "nth-last-of-type": "$.ofType(a,m[3],true)",
        "only-of-type": "$.ofType(a) == 1",
        "only-child": "$.sibling(a).length == 1",
        parent: "a.childNodes.length > 0",
        empty: "a.childNodes.length == 0",
        lang: "a.lang == m[3]",
        root: "a == ( a.ownerDocument ? a.ownerDocument : document ).documentElement",
        contains: "(a.innerText || a.innerHTML).indexOf(m[3]) != -1",
        visible: "(!a.type || a.type != 'hidden') && ($.getCSS(a,'display') != 'none' && $.getCSS(a,'visibility') != 'hidden')",
        hidden: "(a.type && a.type == 'hidden') || $.getCSS(a,'display') == 'none' || $.getCSS(a,'visibility') == 'hidden'",
        enabled: "a.disabled == false",
        disabled: "a.disabled",
        checked: "a.checked",
        indeterminate: "a.checked != null && !a.checked"
    },
    ".": "$.hasWord(a.className,m[2]) || $.hasWord(a.getAttribute('class'),m[2])",
    "@": {
        "=": "a.getAttribute(m[3]) == m[4]",
        "!=": "a.getAttribute(m[3]) != m[4]",
        "~=": "$.hasWord(a.getAttribute(m[3]),m[4])",
        "|=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4])==0:false",
        "^=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4])==0:false",
        "$=": "a.getAttribute(m[3]) != null ? a.getAttribute(m[3]).substr( a.getAttribute(m[3]).length - m[4].length, m[4].length ) == m[4] : false",
        "*=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4]) != -1 : false",
        "": "m[3] == '*' ? a.attributes.length > 0 : a.getAttribute(m[3])"
    },
    "[": "$.Select(m[2],a).length > 0"
};
// Frequently-used Accessors
window.cssQuery = $.Select;
document.getElementsByClass = function(a){return $.Select("."+a)};
document.getElementsBySelector = $.Select;
$.fn = {};

// Move to module
$.fn.text = function(e) {
    if ( !e ) var e = this.cur;
    var t = "";
    for ( var j = 0; j < e.length; j++ ) {
        for ( var i = 0; i < e[j].childNodes.length; i++ )
            t += e[j].childNodes[i].nodeType != 1 ?
                e[j].childNodes[i].nodeValue :
                $.fn.text(e[j].childNodes[i].childNodes);
    }
    return t;
};