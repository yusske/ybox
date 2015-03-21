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
<input type="hidden" id="cid">
  <div data-role="page" >
    <div data-role="header" data-position="fixed">
    <h3>Pide tu canción</h1>
      <div style="padding-left: 10px;padding-top: 0px;padding-right: 10px; margin-top: -15px;" > 
        <input type="search" id="title" data-theme="c"  placeholder="Título - Artista" value="" class="required">
        <button style ="width:100%" id='add' class="ui-btn ui-btn-c ui-corner-all">Agregar</button>
      </div>
    </div><!-- /header -->

    <div role="main" class="ui-content" style="padding-top: 0;">
      <ol data-role="listview" data-inset="true"  >

      </ol>
    </div>

    </div>
  </div>