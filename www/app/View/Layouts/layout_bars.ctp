<!DOCTYPE html> 
<html>
<head>
  <?php echo $this->Html->charset(); ?>
  <title>Temas Solicitados</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php echo $this->Html->css('/js/vendor/jquerymobile/jquery.mobile-1.4.5.min'); ?>
    <?php echo $this->Html->script('vendor/require/require',array('data-main' => 'js/app/main')); ?>
    <?php echo $this->Html->css('/js/vendor/jquerymobile/black.min'); ?>
  <?php echo $this->Html->css('site'); ?>
  
  <script>
            require(['main'], function (main) {
                require(['ranking']);
            });
  </script>
  <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-30410576-1']);
    _gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  </script>

</head>
<body>
	<div data-role="page">
	    <div data-role="header" style="overflow:hidden;">
	      <h1>Temas Solicitados</h1>
        <button id="clear"class="ui-btn ui-btn-c ui-shadow ui-corner-all ui-btn-icon-left ui-icon-recycle">Limpiar Lista</button>
	    </div><!-- /header -->
	    <div role="main" class="ui-content">
		     <ul id="playlist" data-role="listview" data-inset="true"></ul>
	    </div>
	</div>
</body>
</html>