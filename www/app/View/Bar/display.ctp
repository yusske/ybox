<?php if ($record) { $this->start('bar'); ?>
<script>
    __mode = 'BAR';
    __bar = "<?php echo $record['Bar']['slug']; ?>";
</script>
<?php $this->end(); } ?>
<?php if ($error) { $this->start('bar_error'); ?>
<script>
alert("<?php echo $error['title'].' - '.$error['message']; ?>");
</script>
<?php $this->end(); } ?>
<div data-role="page">
    <div data-role="header" style="overflow:hidden;">
      <h1>Temas Solicitados</h1>
        <button id="clear"class="ui-btn ui-btn-c ui-shadow ui-corner-all ui-btn-icon-left ui-icon-recycle">Limpiar Lista</button>
    </div><!-- /header -->
    <div role="main" class="ui-content">
	     <ul id="playlist" data-role="listview" data-inset="true"></ul>
    </div>
</div>