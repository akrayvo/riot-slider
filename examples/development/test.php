<?php

/********************************************************************************************
 * page to test and develop the gallery viewer.
 * created in php to easily make changes dynamically
 ********************************************************************************************/

$images = array(
  'blue-jay',
  'lake-7301021_640',
  'lake-8257272_1280',
  'mountains-8451480_640',
  'party-lights-5232873_1280',
  'pennsylvania-landscape',
  'pet-8274536_640',
  'port-au-prince-haiti',
  'squirrel',
  'tutankhamun-1038544_1280',
  'waterfall-8445292_1280'
);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Riot Gallery Viewer - Test</title>
    <link rel="stylesheet" href="../example-styles.css?x=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../riot-gallery-viewer.css?x=<?php echo time(); ?>">
</head>

<body>
    <div id="page-content">
        <h1>Riot Gallery Viewer - Test</h1>

        <h2>ul (unordered list)</h2>
        <ul class="riot-gallery-viewer riot-gallery-viewer-gallery-default"><?php
            foreach ($images as $image) {
                $caption = ucwords(str_replace('-', ' ', $image));
                echo '<li><img src="../images/'.$image.'_thumb.jpg"><div class="riot-gallery-image-caption">'.htmlentities($caption).'</div></li>'."\n";
            }
        ?></ul>

        <br><br><br>

        <h2>table</h2>
        <table class="riot-gallery-viewer riot-gallery-viewer-gallery-default"><?php
            $columns = 4;
            $item = 0;
            foreach ($images as $image) {
                $item++;
                if ($item % $columns === 1) {
                    echo '<tr>'."\n";
                }
                $caption = ucwords(str_replace('-', ' ', $image));
                echo '<td><img src="../images/'.$image.'_thumb.jpg"><div class="riot-gallery-image-caption">'.htmlentities($caption).'</div></td>';
                if ($item % $columns === 0) {
                    echo '</tr>'."\n";
                }
            }
            if ($item % $columns > 0) {
                while ($item % $columns  > 0) {
                    $item ++;
                    //echo '<td></td>';
                }
                echo '</tr>'."\n";
            }
        ?></table>

        <br><br><br>

        <h2>dl (definition list)</h2>
        <dl class="riot-gallery-viewer riot-gallery-viewer-gallery-default"><?php
            foreach ($images as $image) {
                $caption = ucwords(str_replace('-', ' ', $image));
                echo '<dt><a href="../images/'.$image.'_thumb.jpg" class="data-riot-gallery-image-url" target="_blank">'.$image.'</a></dt><dd class="riot-gallery-image-caption">Image of '.htmlentities($caption).'</dd>'."\n";
            }
        ?></ul>

    </div>
    <script src="../../riot-gallery-viewer.js?x=<?php echo time(); ?>"></script>
</body>

</html>
