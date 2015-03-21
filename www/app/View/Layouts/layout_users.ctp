<!DOCTYPE html>
<html>
<head>
  <?php echo $this->Html->charset(); ?>
  <title>Mi Play list</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <?php echo $this->Html->css('/js/vendor/jquerymobile/jquery.mobile-1.4.5.min'); ?>
  <?php echo $this->Html->script('vendor/require/require',array('data-main' => '/js/app/main')); ?>
  <?php echo $this->Html->css('/js/vendor/jquerymobile/black.min'); ?>
  <?php echo $this->fetch('bar'); ?>
  <?php echo $this->fetch('bar_error'); ?>
  <script>
            require(['main'], function (main) {
                require(['requestsong']);
            });

  </script>
  <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-30410576-1', 'auto');
  ga('send', 'pageview');
  </script>

</head>
<body>

  <?php echo $this->fetch('content'); ?>

<script>
    ga(function(tracker) {
      var clientId = tracker.get('clientId');
      console.log(clientId);
      $('#cid').val(clientId);
    });
</script>
</body>
</html>