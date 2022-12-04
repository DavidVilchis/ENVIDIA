<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ENVIDIA GeFuerza AHORA</title>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous" />
</head>

<body>
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="../index.html">
                <img src="../img/nvidia_logo_icon.png" alt="Logo" width="50" height="30" class="d-inline-block align-text-top" />
                <strong>ENVIDIA</strong>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="../index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="./membership.html">Membership</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="./about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="./pay.php">Payment</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container-xxl text-light" style="background-color: black; height: 100%; padding-bottom: 10%;">
        <div class="row text-center">
            <h1><strong>Payment</strong></h1>
            <h3><strong>Choose an any option for your membership! In "Membership" option</strong></h3>
            <h3></h3>
        </div>
        <div class="card text-center text-bg-dark" style="margin-left: 20%; margin-right: 20%; margin-top: 5%;">
            <div class="card-header">
                <strong>Do you have a membership? Check your historial</strong>
            </div>
            <div class="card-body">
                <div class="container">
                    <form action="payFail.php" method="POST">
                        <div class="row align-items-center mx-auto" style="width: 80%;">
                            <div class="col-md-4" style="text-align: left;">
                                <label for="exampleInputEmail1" class="form-label"><strong>Email address:</strong></label>
                            </div>
                            <div class="col-md-8">
                                <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                            </div>
                        </div>
                        <div class="row align-items-center mx-auto mt-4" style="width: 35%;">
                            <div class="d-grid gap-1">
                                <button class="btn" style="background-color: #43DD10; border-radius: 0; color: white; font-weight: bold;">Verify</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card-footer text-muted">
                We'll never share your email with anyone else.
            </div>
            <table class="table-dark">
                <thead>
                    <tr>
                        <th scope="col">Membership</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if ($_POST) {
                        if ($_POST['email'] != '') {
                            require("./conexion.php");
                            require("./requestDatabase.php");
                            $API = new API();
                            $conexion =  new Conexion();
                            $result = $API->selectHistorial($conexion->getConexion(), $_POST['email']);
                            if ($result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                                    echo "<tr><td>" . $row['idMembership'] . "</td><td>$" . $row['amount'] . " MXN</td></tr>";
                                }
                            }
                            else{
                                echo "<tr><td colspan='2'><h3><strong>There are nothing</strong></h3></td></tr>";
                            }
                        } else {
                            echo '<script>swal("Warning!", "There are empty fields, verify please.", "warning");</script>';
                        }
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row text-center bg-dark text-light">
        <p>
            This web page is a little imitation of NVIDIA GeForce NOW web page. Is
            not real, is to educational purposes.
        </p>
        <p><strong>Copyright © 2022 ENVIDIA Corporation</strong></p>
    </div>
    <div class="row align-items-center bg-dark">
        <img style="width: 5%" src="../img/logoFacebook.png" class="mb-3" />
        <img style="width: 5%" src="../img/logoTwitter.png" class="mb-3" />
        <img style="width: 5%" src="../img/logoTwitch.png" class="mb-3" />
        <img style="width: 5%" src="../img/logoYoutube.png" class="mb-3" />
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>

</html>